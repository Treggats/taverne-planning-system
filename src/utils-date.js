function getMonday(date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function formatTime(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm');
}

function parseDate(s) {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDate(v) {
  if (v instanceof Date) return v;
  return parseDate(v);
}

// Formatteert een tijd-waarde naar HH:mm. Tekstwaarden komen onveranderd terug.
// Voor Date-waarden (cellen die Sheets als tijd heeft getypeerd) MOET de
// tijdzone van de sheet zelf worden gebruikt, niet die van het script — anders
// schuift de tijd als beide tijdzones verschillen. Geef daarom altijd de
// spreadsheet-tijdzone mee (getSpreadsheetTimeZone()).
function asTimeString(v, timeZone) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, timeZone || Session.getScriptTimeZone(), 'HH:mm');
  }
  return String(v ?? '');
}
