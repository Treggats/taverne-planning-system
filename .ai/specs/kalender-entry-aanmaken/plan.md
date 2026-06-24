# Technical Plan

## Components
- `src/calendar.js` — `handleCreate(body)`: valideert verplichte velden,
  bouwt description-string op uit optionele velden (key: value per regel),
  maakt event aan via `CalendarApp` (`createAllDayEvent` of `createEvent`)
- `src/main.js` — routing: POST zonder bekende action → `handleCreate(body)`
  (kalender_event is de fallback in doPost)

## Notities
- Optionele velden worden als `key: value`-regels in de event-beschrijving gezet,
  zodat `getAllEvents` ze bij opvragen automatisch parseert
- `lunch: ja` wordt voor opslag omgezet naar `lunch: A+B+fruit`
