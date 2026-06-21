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
