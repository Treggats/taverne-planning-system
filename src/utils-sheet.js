function readRows(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
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
