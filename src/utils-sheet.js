function openBezorgserviceSheet() {
  return SpreadsheetApp.openById(BEZORGSERVICE_SHEET_ID);
}

function readSheetRows(sheetName) {
  const sheet = openBezorgserviceSheet().getSheetByName(sheetName);
  if (! sheet) throw new Error(`Sheet '${sheetName}' niet gevonden`);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values.shift();
  return values.map(row => zipRow(headers, row));
}

function readHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function zipRow(headers, row) {
  const obj = {};
  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i];
  }
  return obj;
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
