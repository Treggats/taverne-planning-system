function openScheduleSheet() {
  return SpreadsheetApp.openById(SCHEDULE_SHEET_ID);
}

function handleSchedule(week, dateString) {
  const weekLabel = normalizeWeek(week, dateString);
  if (! weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  const scheduleSheet = openScheduleSheet();
  const timeZone = scheduleSheet.getSpreadsheetTimeZone();
  const shifts = readRows(scheduleSheet, 'Diensten')
    .filter(d => String(d.week).trim() === weekLabel)
    .map(d => ({
      week: weekLabel,
      weekdag: String(d.weekdag).trim(),
      naam: String(d.naam).trim(),
      begin: asTimeString(d.begin, timeZone),
      eind: asTimeString(d.eind, timeZone),
      notitie: d.notitie ?? '',
    }));

  shifts.sort((a, b) =>
    WEEKDAYS.indexOf(a.weekdag) - WEEKDAYS.indexOf(b.weekdag) ||
    a.begin.localeCompare(b.begin) ||
    a.naam.localeCompare(b.naam)
  );

  return response({ week: weekLabel, diensten: shifts });
}

function handleShift(body) {
  const weekLabel = normalizeWeek(body.week, body.datum);
  if (! weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  if (! body.weekdag || WEEKDAYS.indexOf(body.weekdag) === -1) {
    return response({ error: 'weekdag moet ma/di/wo/do/vr/za/zo zijn' });
  }

  if (! body.naam) {
    return response({ error: 'Missing field: naam' });
  }

  const sheet = openScheduleSheet().getSheetByName('Diensten');
  const headers = readHeaders(sheet);
  const rowIndex = findShiftRow(sheet, headers, weekLabel, body.weekdag, body.naam);

  if (! body.begin) {
    if (rowIndex !== -1) {
      sheet.deleteRow(rowIndex);
      return response({ success: true, deleted: true });
    }
    return response({ success: true, deleted: false });
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
    return response({ success: true, updated: true });
  }

  sheet.appendRow(row);
  return response({ success: true, added: true });
}

function handleWeekCopy(body) {
  const from = normalizeWeek(body.van, body.van_datum);
  const to = normalizeWeek(body.naar, body.naar_datum);

  if (! from || ! to) {
    return response({ error: 'van en naar zijn verplicht (YYYY-WW of *_datum YYYY-MM-DD)' });
  }

  if (from === to) {
    return response({ error: 'van en naar mogen niet dezelfde week zijn' });
  }

  const scheduleSheet = openScheduleSheet();
  const timeZone = scheduleSheet.getSpreadsheetTimeZone();
  const sheet = scheduleSheet.getSheetByName('Diensten');
  const headers = readHeaders(sheet);

  const allShifts = readRows(scheduleSheet, 'Diensten');
  const source = allShifts.filter(d => String(d.week).trim() === from);

  if (source.length === 0) {
    return response({ error: `Geen diensten gevonden voor week ${from}` });
  }

  const exists = allShifts.some(d => String(d.week).trim() === to);

  if (exists) {
    return response({ error: `Week ${to} bevat al diensten; eerst leegmaken` });
  }

  const rows = source.map(d => headers.map(h => {
    if (h === 'week') return to;
    const v = d[h];
    return (h === 'begin' || h === 'eind') ? asTimeString(v, timeZone) : (v ?? '');
  }));

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);

  return response({ success: true, copied: rows.length, van: from, naar: to });
}

function handleEmployee(body) {
  if (! body.naam) {
    return response({ error: 'Missing field: naam' });
  }

  if (body.type && EMPLOYEE_TYPES.indexOf(body.type) === -1) {
    return response({ error: `type moet ${EMPLOYEE_TYPES.join(', ')} zijn` });
  }

  const sheet = openScheduleSheet().getSheetByName('Medewerkers');
  const headers = readHeaders(sheet);
  const rowIndex = findEmployeeRow(sheet, headers, body.naam);

  const record = {
    naam: body.naam,
    type: body.type ?? 'vast',
    actief: body.actief ?? 'ja',
  };
  const row = headers.map(h => record[h] ?? '');

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
    return response({ success: true, updated: true });
  }

  sheet.appendRow(row);
  return response({ success: true, added: true });
}

function findShiftRow(sheet, headers, week, weekday, name) {
  const values = sheet.getDataRange().getValues();
  const w = headers.indexOf('week');
  const d = headers.indexOf('weekdag');
  const n = headers.indexOf('naam');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][w]).trim() === week &&
        String(values[i][d]).trim() === weekday &&
        String(values[i][n]).trim() === String(name).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function findEmployeeRow(sheet, headers, name) {
  const values = sheet.getDataRange().getValues();
  const n = headers.indexOf('naam');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][n]).trim() === String(name).trim()) {
      return i + 1;
    }
  }
  return -1;
}

function normalizeWeek(week, dateString) {
  if (week) {
    return String(week).trim();
  }
  if (dateString) {
    return isoWeekLabel(parseDate(dateString));
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
