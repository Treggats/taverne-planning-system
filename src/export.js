function handleWeekExport(body) {
  const weekLabel = normalizeWeek(body.week, body.datum);
  if (!weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  const [year, week] = weekLabel.split('-');
  const naam = `weekplanning-${year}-${week}`;
  const folder = DriveApp.getFolderById(WEEKPLANNINGEN_FOLDER_ID);

  const existing = folder.getFilesByName(naam);
  if (existing.hasNext()) {
    return response({ error: `Export voor ${weekLabel} bestaat al: ${naam}` });
  }

  let template;
  try {
    template = DriveApp.getFileById(EXPORT_TEMPLATE_ID);
  } catch (e) {
    return response({ error: 'Template niet gevonden' });
  }

  const copy = template.makeCopy(naam, folder);
  const exportSheet = SpreadsheetApp.open(copy);
  const dates = weekDates(weekLabel);

  fillGegevensTab(exportSheet, dates);
  fillPlanningTab(exportSheet, weekLabel, dates);
  fillBestellingTab(exportSheet, weekLabel, dates);
  for (const date of dates.slice(0, 6)) {
    fillDagTab(exportSheet, date);
  }

  return response({ success: true, naam, url: exportSheet.getUrl() });
}

function weekDates(weekLabel) {
  const [yearStr, weekStr] = weekLabel.split('-');
  const year = Number(yearStr);
  const week = Number(weekStr);
  // ISO week 1 = the week containing Jan 4
  const jan4 = new Date(year, 0, 4);
  const dow = (jan4.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dow + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fillGegevensTab(sheet, dates) {
  const tab = sheet.getSheetByName('gegevens');
  if (!tab) return;
  tab.getRange(2, 1, 7, 1).setValues(dates.map(d => [formatDate(d)]));
}

function fillPlanningTab(sheet, weekLabel, dates) {
  const tab = sheet.getSheetByName('Planning');
  if (!tab) return;

  const weekNum = weekLabel.split('-')[1];
  tab.getRange('A1').setValue(`Week ${weekNum}`);

  const tz = Session.getScriptTimeZone();
  tab.getRange(3, 2, 1, 7).setValues([
    dates.map(d => Utilities.formatDate(d, tz, 'dd/MM/yyyy'))
  ]);

  const nextDay = new Date(dates[6]);
  nextDay.setDate(dates[6].getDate() + 1);
  const events = getAllEvents(dates[0], nextDay);

  const byDate = {};
  for (const e of events) {
    if (!byDate[e.datum]) byDate[e.datum] = [];
    byDate[e.datum].push(e);
  }

  let maxEvents = 0;
  for (const d of dates) {
    const cnt = (byDate[formatDate(d)] || []).length;
    if (cnt > maxEvents) maxEvents = cnt;
  }

  if (maxEvents > 0) {
    const rows = Array.from({ length: maxEvents }, (_, i) =>
      dates.map(d => {
        const evs = byDate[formatDate(d)] || [];
        if (i >= evs.length) return '';
        const ev = evs[i];
        if (ev.geheel_dag) return ev.naam;
        return `${ev.begin}–${ev.eind} ${ev.naam}`;
      })
    );
    tab.getRange(4, 2, rows.length, 7).setValues(rows);
  }
}

function fillBestellingTab(sheet, weekLabel, dates) {
  const tab = sheet.getSheetByName('Bestelling');
  if (!tab) return;

  const weekNum = weekLabel.split('-')[1];
  const tz = Session.getScriptTimeZone();
  const maStr = Utilities.formatDate(dates[0], tz, 'dd/MM');
  const zaStr = Utilities.formatDate(dates[5], tz, 'dd/MM');
  tab.getRange('A1').setValue(`Week ${weekNum}  |  ${maStr}–${zaStr}`);

  const dayAbbr = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const allDeliveries = dates.slice(0, 6).map(d => {
    const result = handleDeliveries(formatDate(d));
    return JSON.parse(result.getContent()).entries || [];
  });

  const clientMap = {};
  for (let i = 0; i < 6; i++) {
    for (const entry of allDeliveries[i]) {
      const id = String(entry.klant_id);
      if (!clientMap[id]) {
        clientMap[id] = {
          klant_id: entry.klant_id,
          tijd: entry.tijd,
          naam: entry.naam,
          adres: entry.adres,
          opmerkingen: entry.opmerkingen,
          days: Array(6).fill(null),
        };
      }
      clientMap[id].days[i] = {
        aantal: entry.porties || 1,
        toetje: entry.toetje || '',
        bezorger: entry.bezorger || '',
      };
    }
  }

  const fixedHeaders = ['Tijd', 'Voornaam', 'Achternaam', 'Adres', 'Klant nr', 'Opmerkingen'];
  const dayHeaders = dayAbbr.flatMap(d => [d, `${d}-Toetje`, `${d}-Bezorger`]);
  const headerRow = [...fixedHeaders, ...dayHeaders];
  tab.getRange(2, 1, 1, headerRow.length).setValues([headerRow]);

  const clients = Object.values(clientMap);
  clients.sort((a, b) => a.tijd.localeCompare(b.tijd) || a.naam.localeCompare(b.naam));

  if (clients.length > 0) {
    const rows = clients.map(c => {
      const parts = c.naam.split(' ');
      const dayData = c.days.flatMap(d => d ? [d.aantal, d.toetje, d.bezorger] : ['', '', '']);
      return [c.tijd, parts[0], parts.slice(1).join(' '), c.adres, c.klant_id, c.opmerkingen, ...dayData];
    });
    tab.getRange(3, 1, rows.length, headerRow.length).setValues(rows);
  }
}

function fillDagTab(sheet, date) {
  const NL_DAYS   = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const NL_MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const tabName = `${NL_DAYS[date.getDay()]} ${date.getDate()} ${NL_MONTHS[date.getMonth()]}`;

  const templateTab = sheet.getSheetByName('Dag template');
  if (!templateTab) return;

  const copy = templateTab.copyTo(sheet);
  copy.setName(tabName);

  const result = handleDeliveries(formatDate(date));
  const entries = JSON.parse(result.getContent()).entries || [];

  if (entries.length > 0) {
    const rows = entries.map(e => {
      const parts = e.naam.split(' ');
      return [e.tijd, parts[0], parts.slice(1).join(' '), e.adres, e.telefoon, e.opmerkingen, e.toetje, e.bezorger];
    });
    copy.getRange(2, 1, rows.length, 8).setValues(rows);
  }
}
