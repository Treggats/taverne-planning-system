const AUTH_TOKEN = 'ExclusiveMarriedArroganceAutopilotBlabberBadlandDaycareSlang';
const URL = 'https://script.google.com/macros/s/AKfycbwdRnxoP1LtrWUF_jaXXO4Mhim9PqnqUR1QpZM1_1yQYVP00gOGv6JyVVCigSkYONlF/exec';

const CALENDARS = {
  taverne: 'Taverne',
  mspa: 'MSPA',
  jules: 'Jules Huiskamer'
};

const BEZORGSERVICE_SHEET_ID = '1r5i_SUqkW1FnV2jlVcAMumQZVMJMUWWTul0Cxo_WPjI';
const WEEKDAGEN = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const AFWIJKING_TYPES = ['annulering', 'wijziging', 'extra'];
const BEZORGWIJZEN = ['bezorgen', 'ophalen', 'ter_plaatse'];

function doGet(e) {
  if (! isAuthenticated(e.parameter.token)) {
    return response({ error: 'Unauthorized' });
  }

  const action = e.parameter.action;

  if (action === 'today') {
    return handleToday();
  }

  if (action === 'week') {
    return handleWeek(e.parameter.date);
  }

  if (action === 'bezorgingen') {
    return handleBezorgingen(e.parameter.datum);
  }

  return response({ error: 'Unknown action' });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  if (! isAuthenticated(body.token)) {
    return response({ error: 'Unauthorized' });
  }

  const action = body.action;

  if (action === 'afwijking') {
    return handleAfwijking(body);
  }

  if (action === 'klant') {
    return handleKlant(body);
  }

  if (action === 'menu') {
    return handleMenu(body);
  }

  return handleCreate(body);
}

function handleToday() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return response({ date: formatDate(today), entries: getAllEvents(start, end) });
}

function handleWeek(dateString) {
  if (! dateString) {
    return response({ error: 'Missing date parameter' });
  }

  const monday = getMonday(new Date(dateString));
  const sunday = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000);
  return response({ week_start: formatDate(monday), entries: getAllEvents(monday, sunday) });
}

function handleCreate(body) {
  const required = ['kalender', 'datum', 'begin', 'eind', 'naam'];

  for (const field of required) {
    if (body[field] === undefined || body[field] === '') {
      return response({ error: `Missing field: ${field}` });
    }
  }

  if (! CALENDARS[body.kalender]) {
    return response({ error: 'kalender moet taverne, mspa of jules zijn' });
  }

  const calendars = CalendarApp.getCalendarsByName(CALENDARS[body.kalender]);
  if (calendars.length === 0) {
    return response({ error: `Kalender '${CALENDARS[body.kalender]}' niet gevonden` });
  }

  const [startH, startM] = body.begin.split(':').map(Number);
  const [endH, endM] = body.eind.split(':').map(Number);
  const [year, month, day] = body.datum.split('-').map(Number);

  const startTime = new Date(year, month - 1, day, startH, startM);
  const endTime = new Date(year, month - 1, day, endH, endM);

  const lunchValue = body.lunch === 'ja' ? 'A+B+fruit' : body.lunch;

  const fields = [];
  if (body.organisatie) fields.push(`organisatie: ${body.organisatie}`);
  if (body.locatie) fields.push(`locatie: ${body.locatie}`);
  if (body.aantal) fields.push(`aantal: ${body.aantal}`);
  if (lunchValue) fields.push(`lunch: ${lunchValue}`);
  if (body.notities) fields.push(`notities: ${body.notities}`);

  calendars[0].createEvent(body.naam, startTime, endTime, {
    description: fields.join('\n'),
    location: body.locatie ?? ''
  });

  return response({ success: true });
}

function getAllEvents(start, end) {
  const entries = [];

  for (const [key, name] of Object.entries(CALENDARS)) {
    const calendars = CalendarApp.getCalendarsByName(name);
    if (calendars.length === 0) continue;

    const events = calendars[0].getEvents(start, end);

    for (const event of events) {
      const isAllDay = event.isAllDayEvent();
      const entry = {
        kalender: key,
        naam: event.getTitle(),
        datum: formatDate(event.getStartTime()),
      };

      if (isAllDay) {
        entry.geheel_dag = true;
      } else {
        entry.begin = formatTime(event.getStartTime());
        entry.eind = formatTime(event.getEndTime());
      }

      const desc = event.getDescription();
      if (desc) {
        for (const line of desc.split('\n')) {
          const colonIndex = line.indexOf(': ');
          if (colonIndex !== -1) {
            const field = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 2).trim();
            entry[field] = value;
          }
        }
      }

      entries.push(entry);
    }
  }

  return entries.sort((a, b) =>
    a.datum.localeCompare(b.datum) || (a.begin ?? '').localeCompare(b.begin ?? '')
  );
}

function handleMenu(body) {
  if (! body.datum) {
    return response({ error: 'Missing field: datum' });
  }

  if (! body.menu) {
    return response({ error: 'Missing field: menu' });
  }

  const calendars = CalendarApp.getCalendarsByName(CALENDARS.taverne);
  if (calendars.length === 0) {
    return response({ error: `Kalender '${CALENDARS.taverne}' niet gevonden` });
  }

  const [year, month, day] = body.datum.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  calendars[0].createAllDayEvent('Menu', date, {
    description: `menu: ${body.menu}`
  });

  return response({ success: true });
}

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

function isAuthenticated(token) {
  return token === AUTH_TOKEN;
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// Bezorgservice
// ============================================================

function handleBezorgingen(datumString) {
  if (! datumString) {
    return response({ error: 'Missing datum parameter (YYYY-MM-DD)' });
  }

  const datum = parseDate(datumString);
  const weekdag = WEEKDAGEN[datum.getDay()];

  const klanten = readSheetRows('Klanten');
  const afwijkingen = readSheetRows('Afwijkingen');

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

function parseDate(s) {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDate(v) {
  if (v instanceof Date) return v;
  return parseDate(v);
}

function asTimeString(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm');
  }
  return String(v ?? '');
}
