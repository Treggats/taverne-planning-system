function openBezorgserviceSheet() {
  return SpreadsheetApp.openById(BEZORGSERVICE_SHEET_ID);
}


function volgendKlantId(sheet, headers) {
  const idCol = headers.indexOf('klant_id');
  if (idCol === -1) return 100;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 100;
  const ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues().flat();
  const real = ids.filter(id => typeof id === 'number' && id < 9000);
  return real.length ? Math.max.apply(null, real) + 1 : 100;
}

function handleBezorgingen(datumString) {
  if (! datumString) {
    return response({ error: 'Missing datum parameter (YYYY-MM-DD)' });
  }

  const datum = parseDate(datumString);
  const weekdag = WEEKDAGEN[datum.getDay()];

  const klanten = readRows(openBezorgserviceSheet(), 'Klanten');
  const afwijkingen = readRows(openBezorgserviceSheet(), 'Afwijkingen');

  const relevant = afwijkingen.filter(a => afwijkingGeldtVoor(a, datum, weekdag));

  const annuleringen = new Set(
    relevant.filter(a => a.type === 'annulering').map(a => String(a.klant_id))
  );

  const wijzigingen = {};
  for (const a of relevant.filter(a => a.type === 'wijziging')) {
    wijzigingen[String(a.klant_id)] = a;
  }

  const klantenById = {};
  for (const k of klanten) {
    klantenById[String(k.klant_id)] = k;
  }

  const entries = klanten
    .filter(k => String(k.actief).toLowerCase() === 'ja')
    .filter(k => roosterBevat(k.rooster, weekdag))
    .filter(k => ! annuleringen.has(String(k.klant_id)))
    .map(k => buildBezorgEntry(k, wijzigingen[String(k.klant_id)]));

  for (const ex of relevant.filter(a => a.type === 'extra')) {
    const klant = klantenById[String(ex.klant_id)];
    if (! klant) continue;
    entries.push(buildBezorgEntry(klant, ex));
  }

  entries.sort((a, b) =>
    a.tijd.localeCompare(b.tijd) || a.naam.localeCompare(b.naam)
  );

  return response({
    datum: datumString,
    weekdag,
    entries,
  });
}

function handleAfwijking(body) {
  if (! body.klant_id) {
    return response({ error: 'Missing field: klant_id' });
  }

  if (! body.type) {
    return response({ error: 'Missing field: type' });
  }

  if (AFWIJKING_TYPES.indexOf(body.type) === -1) {
    return response({ error: `type moet ${AFWIJKING_TYPES.join(', ')} zijn` });
  }

  if (! body.datum && ! body.weekdag) {
    return response({ error: 'datum of weekdag verplicht' });
  }

  if (body.weekdag && WEEKDAGEN.indexOf(body.weekdag) === -1) {
    return response({ error: 'weekdag moet ma/di/wo/do/vr/za/zo zijn' });
  }

  if (body.bezorgwijze && BEZORGWIJZEN.indexOf(body.bezorgwijze) === -1) {
    return response({ error: `bezorgwijze moet ${BEZORGWIJZEN.join(', ')} zijn` });
  }

  const sheet = openBezorgserviceSheet().getSheetByName('Afwijkingen');
  const headers = readHeaders(sheet);
  const row = headers.map(h => body[h] ?? '');
  sheet.appendRow(row);

  return response({ success: true });
}

function handleKlant(body) {
  if (! body.voornaam) {
    return response({ error: 'Missing field: voornaam' });
  }

  if (! body.rooster) {
    return response({ error: 'Missing field: rooster' });
  }

  if (! body.vaste_bezorgtijd) {
    return response({ error: 'Missing field: vaste_bezorgtijd' });
  }

  if (! body.bezorgwijze || BEZORGWIJZEN.indexOf(body.bezorgwijze) === -1) {
    return response({ error: `bezorgwijze moet ${BEZORGWIJZEN.join(', ')} zijn` });
  }

  for (const dag of String(body.rooster).split(',').map(s => s.trim())) {
    if (WEEKDAGEN.indexOf(dag) === -1) {
      return response({ error: `rooster bevat ongeldige weekdag: ${dag}` });
    }
  }

  const sheet = openBezorgserviceSheet().getSheetByName('Klanten');
  const headers = readHeaders(sheet);

  if (! body.klant_id) {
    body.klant_id = volgendKlantId(sheet, headers);
  }

  if (body.porties === undefined || body.porties === '') body.porties = 1;
  if (body.vast_toetje === undefined || body.vast_toetje === '') body.vast_toetje = 'nee';
  if (body.actief === undefined || body.actief === '') body.actief = 'ja';

  const row = headers.map(h => body[h] ?? '');
  sheet.appendRow(row);

  return response({ success: true, klant_id: body.klant_id });
}

function afwijkingGeldtVoor(afwijking, datum, weekdag) {
  if (afwijking.datum) {
    const d = toDate(afwijking.datum);
    return d.getFullYear() === datum.getFullYear() &&
           d.getMonth() === datum.getMonth() &&
           d.getDate() === datum.getDate();
  }
  if (afwijking.weekdag) {
    return String(afwijking.weekdag).trim() === weekdag;
  }
  return false;
}

function roosterBevat(rooster, weekdag) {
  if (! rooster) return false;
  return String(rooster).split(',').map(s => s.trim()).indexOf(weekdag) !== -1;
}

function buildBezorgEntry(klant, afwijking) {
  const a = afwijking || {};
  const toetje = (firstSet(a.toetje, klant.vast_toetje) === 'ja') ? 'ja' : 'nee';
  return {
    klant_id: klant.klant_id,
    naam: `${klant.voornaam ?? ''} ${klant.achternaam ?? ''}`.trim(),
    adres: klant.adres ?? '',
    telefoon: klant.telefoon ?? '',
    tijd: asTimeString(firstSet(a.tijd, klant.vaste_bezorgtijd)),
    porties: firstSet(a.porties, klant.porties),
    toetje,
    bezorgwijze: firstSet(a.bezorgwijze, klant.bezorgwijze),
    bezorger: a.bezorger ?? '',
    opmerkingen: klant.bezorg_opmerkingen ?? '',
    dieetwensen: klant.dieetwensen ?? '',
    notitie: a.notitie ?? '',
  };
}

function firstSet(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}
