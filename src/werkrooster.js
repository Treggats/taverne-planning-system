function openWerkroosterSheet() {
  return SpreadsheetApp.openById(WERKROOSTER_SHEET_ID);
}

function handleWerkrooster(week, datumString) {
  const weekLabel = normalizeWeek(week, datumString);
  if (! weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  const diensten = readRows(openWerkroosterSheet(), 'Diensten')
    .filter(d => String(d.week).trim() === weekLabel)
    .map(d => ({
      week: weekLabel,
      weekdag: String(d.weekdag).trim(),
      naam: String(d.naam).trim(),
      begin: asTimeString(d.begin),
      eind: asTimeString(d.eind),
      notitie: d.notitie ?? '',
    }));

  diensten.sort((a, b) =>
    WEEKDAGEN.indexOf(a.weekdag) - WEEKDAGEN.indexOf(b.weekdag) ||
    a.begin.localeCompare(b.begin) ||
    a.naam.localeCompare(b.naam)
  );

  return response({ week: weekLabel, diensten });
}

function handleDienst(body) {
  const weekLabel = normalizeWeek(body.week, body.datum);
  if (! weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  if (! body.weekdag || WEEKDAGEN.indexOf(body.weekdag) === -1) {
    return response({ error: 'weekdag moet ma/di/wo/do/vr/za/zo zijn' });
  }

  if (! body.naam) {
    return response({ error: 'Missing field: naam' });
  }

  const sheet = openWerkroosterSheet().getSheetByName('Diensten');
  const headers = readHeaders(sheet);
  const rowIndex = vindDienstRij(sheet, headers, weekLabel, body.weekdag, body.naam);

  if (! body.begin) {
    if (rowIndex !== -1) {
      sheet.deleteRow(rowIndex);
      return response({ success: true, verwijderd: true });
    }
    return response({ success: true, verwijderd: false });
  }

  const record = {
    week: weekLabel,
    weekdag: body.weekdag,
    naam: body.naam,
    begin: body.begin,
    eind: body.eind ?? '',
    notitie: body.notitie ?? '',
  };
  const row = headers.map(h => record[h] ?? '');

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
    return response({ success: true, gewijzigd: true });
  }

  sheet.appendRow(row);
  return response({ success: true, toegevoegd: true });
}

function handleWeekKopieer(body) {
  const van = normalizeWeek(body.van, body.van_datum);
  const naar = normalizeWeek(body.naar, body.naar_datum);

  if (! van || ! naar) {
    return response({ error: 'van en naar zijn verplicht (YYYY-WW of *_datum YYYY-MM-DD)' });
  }

  if (van === naar) {
    return response({ error: 'van en naar mogen niet dezelfde week zijn' });
  }

  const sheet = openWerkroosterSheet().getSheetByName('Diensten');
  const headers = readHeaders(sheet);

  const bron = readRows(openWerkroosterSheet(), 'Diensten')
    .filter(d => String(d.week).trim() === van);

  if (bron.length === 0) {
    return response({ error: `Geen diensten gevonden voor week ${van}` });
  }

  const bestaat = readRows(openWerkroosterSheet(), 'Diensten')
    .some(d => String(d.week).trim() === naar);

  if (bestaat) {
    return response({ error: `Week ${naar} bevat al diensten; eerst leegmaken` });
  }

  const rows = bron.map(d => headers.map(h => {
    if (h === 'week') return naar;
    const v = d[h];
    return (h === 'begin' || h === 'eind') ? asTimeString(v) : (v ?? '');
  }));

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);

  return response({ success: true, gekopieerd: rows.length, van, naar });
}

function handleMedewerker(body) {
  if (! body.naam) {
    return response({ error: 'Missing field: naam' });
  }

  if (body.type && MEDEWERKER_TYPES.indexOf(body.type) === -1) {
    return response({ error: `type moet ${MEDEWERKER_TYPES.join(', ')} zijn` });
  }

  const sheet = openWerkroosterSheet().getSheetByName('Medewerkers');
  const headers = readHeaders(sheet);
  const rowIndex = vindMedewerkerRij(sheet, headers, body.naam);

  const record = {
    naam: body.naam,
    type: body.type ?? 'vast',
    actief: body.actief ?? 'ja',
  };
  const row = headers.map(h => record[h] ?? '');

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
    return response({ success: true, gewijzigd: true });
  }

  sheet.appendRow(row);
  return response({ success: true, toegevoegd: true });
}

function vindDienstRij(sheet, headers, week, weekdag, naam) {
  const values = sheet.getDataRange().getValues();
  const w = headers.indexOf('week');
  const d = headers.indexOf('weekdag');
  const n = headers.indexOf('naam');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][w]).trim() === week &&
        String(values[i][d]).trim() === weekdag &&
        String(values[i][n]).trim() === String(naam).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function vindMedewerkerRij(sheet, headers, naam) {
  const values = sheet.getDataRange().getValues();
  const n = headers.indexOf('naam');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][n]).trim() === String(naam).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function normalizeWeek(week, datumString) {
  if (week) {
    return String(week).trim();
  }
  if (datumString) {
    return isoWeekLabel(parseDate(datumString));
  }
  return '';
}

function isoWeekLabel(date) {
  // ISO-8601: week 1 = de week met de eerste donderdag; weekjaar kan
  // afwijken van het kalenderjaar rond de jaargrens (zie GOTCHAS.md).
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day + 3);
  const firstThursday = new Date(d.getFullYear(), 0, 4);
  const ft = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - ft + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${d.getFullYear()}-${week}`;
}
