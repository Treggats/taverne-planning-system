# Plan: weekplanning exporteren

## Nieuw bestand: `src/export.js`

### Hoofdfunctie
```js
function handleWeekExport(body) {
  const weekLabel = normalizeWeek(body.week, body.datum);
  if (! weekLabel) {
    return response({ error: 'week (YYYY-WW) of datum (YYYY-MM-DD) verplicht' });
  }

  const [year, week] = weekLabel.split('-');
  const naam = `weekplanning-${year}-${week}`;
  const folder = DriveApp.getFolderById(WEEKPLANNINGEN_FOLDER_ID);

  // Duplicate check
  const existing = folder.getFilesByName(naam);
  if (existing.hasNext()) {
    return response({ error: `Export voor ${weekLabel} bestaat al: ${naam}` });
  }

  // Kopieer template
  const template = DriveApp.getFileById(EXPORT_TEMPLATE_ID);
  const copy = template.makeCopy(naam, folder);
  const exportSheet = SpreadsheetApp.open(copy);

  // Datums bepalen (maandag t/m zondag van de week)
  const dates = weekDates(weekLabel); // array van 7 Date-objecten

  fillGegevensTab(exportSheet, dates);
  fillPlanningTab(exportSheet, weekLabel, dates);
  fillBestellingTab(exportSheet, weekLabel, dates);
  for (const [i, date] of dates.slice(0, 6).entries()) {
    fillDagTab(exportSheet, date);
  }

  return response({ success: true, naam, url: exportSheet.getUrl() });
}
```

### Hulpfuncties

**`weekDates(weekLabel)`** — geeft array van 7 Date-objecten (ma t/m zo) terug op
basis van YYYY-WW. Maandag = dag 0.

**`fillGegevensTab(sheet, dates)`**
- Tab: `gegevens`
- A2:A8 ← datums ma t/m zo (als Date-objecten; sheet formatteert zelf)

**`fillPlanningTab(sheet, weekLabel, dates)`**
- Tab: `Planning`
- A1 ← "Week `<weeknummer>`"
- B3:H3 ← datums
- Haal kalenderdata op via `handleWeek(dates[0])` (intern aanroepen)
- Schrijf items per dag in kolom B t/m H, gesorteerd op begintijd

**`fillBestellingTab(sheet, weekLabel, dates)`**
- Tab: `Bestelling`
- A1 ← "Week X  |  `<ma>`–`<za>`"
- Haal bezorgdata op: `handleDeliveries(datum)` voor elke dag (ma t/m za)
- Bouw één rij per unieke klant; kolommen per dag: aantal | toetje | bezorger

**`fillDagTab(sheet, date)`**
- Kopieert `Dag template`-tabblad en hernoemt het naar de dagnaam (bijv. "Maandag 24 mrt")
- Vult de bezorglijst voor die dag (kolommen: tijd | naam | adres | telefoon |
  opmerkingen | toetje | bezorger), gesorteerd op tijd

### Werkrooster-tab
Wordt in een latere iteratie gevuld zodra de kolomindeling bekend is.
Voor nu: tab blijft leeg (template-inhoud ongewijzigd).

---

## `src/config.js`
```js
const EXPORT_TEMPLATE_ID    = '1TANXejPS95x2z5rwKlOmelQmSj5-73rkzmqBMJAi7W0';
const WEEKPLANNINGEN_FOLDER_ID = '1HNs0w_MOtTSbgI4XekNuZTnoIHvX9sK1';
```

---

## `src/main.js`
```js
if (action === 'week_export') {
  return handleWeekExport(body);
}
```

---

## `docs/openapi.yaml`
POST-enum uitbreiden met `week_export`:
```yaml
week_export = weekplanning exporteren naar Google Sheets (verplicht: week of datum).
```

---

## `docs/chatgpt-prompt.md`
`## Weekexport`-sectie vervangen:
- Oud: 4 handmatige stappen die de GPT zelf uitvoert
- Nieuw: één aanroep `POST action=week_export`, GPT geeft URL terug aan Antje
