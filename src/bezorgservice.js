function openDeliverySheet() {
  return SpreadsheetApp.openById(DELIVERY_SHEET_ID);
}

function nextClientId(sheet, headers) {
  const idCol = headers.indexOf('klant_id');
  if (idCol === -1) return 100;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 100;
  const ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues().flat();
  const real = ids.filter(id => typeof id === 'number' && id < 9000);
  return real.length ? Math.max.apply(null, real) + 1 : 100;
}

function handleListClients() {
  const clients = readRows(openDeliverySheet(), 'Klanten')
    .map(c => ({
      klant_id:         c.klant_id,
      voornaam:         String(c.voornaam ?? '').trim(),
      achternaam:       String(c.achternaam ?? '').trim(),
      rooster:          String(c.rooster ?? '').trim(),
      vaste_bezorgtijd: String(c.vaste_bezorgtijd ?? '').trim(),
      bezorgwijze:      String(c.bezorgwijze ?? '').trim(),
      actief:           String(c.actief ?? '').trim(),
    }))
    .filter(c => c.voornaam !== '');

  clients.sort((a, b) =>
    a.achternaam.localeCompare(b.achternaam) || a.voornaam.localeCompare(b.voornaam)
  );

  return response({ klanten: clients });
}

function handleDeliveries(dateString) {
  if (! dateString) {
    return response({ error: 'Missing datum parameter (YYYY-MM-DD)' });
  }

  const date = parseDate(dateString);
  const weekday = WEEKDAYS[date.getDay()];

  const deliverySheet = openDeliverySheet();
  const timeZone = deliverySheet.getSpreadsheetTimeZone();
  const clients = readRows(deliverySheet, 'Klanten');
  const exceptions = readRows(deliverySheet, 'Afwijkingen');

  const relevant = exceptions.filter(a => exceptionAppliesOn(a, date, weekday));

  const cancellations = new Set(
    relevant.filter(a => a.type === 'annulering').map(a => String(a.klant_id))
  );

  const modifications = {};
  for (const a of relevant.filter(a => a.type === 'wijziging')) {
    modifications[String(a.klant_id)] = a;
  }

  const clientsById = {};
  for (const c of clients) {
    clientsById[String(c.klant_id)] = c;
  }

  const entries = clients
    .filter(c => String(c.actief).toLowerCase() === 'ja')
    .filter(c => scheduleIncludes(c.rooster, weekday))
    .filter(c => ! cancellations.has(String(c.klant_id)))
    .map(c => buildDeliveryEntry(c, modifications[String(c.klant_id)], timeZone));

  for (const ex of relevant.filter(a => a.type === 'extra')) {
    const client = clientsById[String(ex.klant_id)];
    if (! client) continue;
    entries.push(buildDeliveryEntry(client, ex, timeZone));
  }

  entries.sort((a, b) =>
    a.tijd.localeCompare(b.tijd) || a.naam.localeCompare(b.naam)
  );

  return response({
    datum: dateString,
    weekdag: weekday,
    entries,
  });
}

function handleException(body) {
  if (! body.klant_id) {
    return response({ error: 'Missing field: klant_id' });
  }

  if (! body.type) {
    return response({ error: 'Missing field: type' });
  }

  if (EXCEPTION_TYPES.indexOf(body.type) === -1) {
    return response({ error: `type moet ${EXCEPTION_TYPES.join(', ')} zijn` });
  }

  if (! body.datum && ! body.weekdag) {
    return response({ error: 'datum of weekdag verplicht' });
  }

  if (body.weekdag && WEEKDAYS.indexOf(body.weekdag) === -1) {
    return response({ error: 'weekdag moet ma/di/wo/do/vr/za/zo zijn' });
  }

  if (body.bezorgwijze && DELIVERY_METHODS.indexOf(body.bezorgwijze) === -1) {
    return response({ error: `bezorgwijze moet ${DELIVERY_METHODS.join(', ')} zijn` });
  }

  const sheet = openDeliverySheet().getSheetByName('Afwijkingen');
  const headers = readHeaders(sheet);
  const row = headers.map(h => body[h] ?? '');
  sheet.appendRow(row);

  return response({ success: true });
}

function handleClient(body) {
  if (! body.voornaam) {
    return response({ error: 'Missing field: voornaam' });
  }

  if (! body.rooster) {
    return response({ error: 'Missing field: rooster' });
  }

  if (! body.vaste_bezorgtijd) {
    return response({ error: 'Missing field: vaste_bezorgtijd' });
  }

  if (! body.bezorgwijze || DELIVERY_METHODS.indexOf(body.bezorgwijze) === -1) {
    return response({ error: `bezorgwijze moet ${DELIVERY_METHODS.join(', ')} zijn` });
  }

  for (const day of String(body.rooster).split(',').map(s => s.trim())) {
    if (WEEKDAYS.indexOf(day) === -1) {
      return response({ error: `rooster bevat ongeldige weekdag: ${day}` });
    }
  }

  const sheet = openDeliverySheet().getSheetByName('Klanten');
  const headers = readHeaders(sheet);

  if (! body.klant_id) {
    body.klant_id = nextClientId(sheet, headers);
  }

  if (body.porties === undefined || body.porties === '') body.porties = 1;
  if (body.vast_toetje === undefined || body.vast_toetje === '') body.vast_toetje = 'nee';
  if (body.actief === undefined || body.actief === '') body.actief = 'ja';

  const row = headers.map(h => body[h] ?? '');
  sheet.appendRow(row);

  return response({ success: true, klant_id: body.klant_id });
}

function exceptionAppliesOn(exception, date, weekday) {
  if (exception.datum) {
    const d = toDate(exception.datum);
    return d.getFullYear() === date.getFullYear() &&
           d.getMonth() === date.getMonth() &&
           d.getDate() === date.getDate();
  }
  if (exception.weekdag) {
    return String(exception.weekdag).trim() === weekday;
  }
  return false;
}

function scheduleIncludes(schedule, weekday) {
  if (! schedule) return false;
  return String(schedule).split(',').map(s => s.trim()).indexOf(weekday) !== -1;
}

function buildDeliveryEntry(client, exception, timeZone) {
  const ex = exception || {};
  const dessert = (firstSet(ex.toetje, client.vast_toetje) === 'ja') ? 'ja' : 'nee';
  return {
    klant_id: client.klant_id,
    naam: `${client.voornaam ?? ''} ${client.achternaam ?? ''}`.trim(),
    adres: client.adres ?? '',
    telefoon: client.telefoon ?? '',
    tijd: asTimeString(firstSet(ex.tijd, client.vaste_bezorgtijd), timeZone),
    porties: firstSet(ex.porties, client.porties),
    toetje: dessert,
    bezorgwijze: firstSet(ex.bezorgwijze, client.bezorgwijze),
    bezorger: ex.bezorger ?? '',
    opmerkingen: client.bezorg_opmerkingen ?? '',
    dieetwensen: client.dieetwensen ?? '',
    notitie: ex.notitie ?? '',
  };
}

function firstSet(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}
