# Technical Plan

## Components
- `src/calendar.js` — `handleWeek(dateString)`: berekent maandag via `getMonday()`,
  stelt end in op maandag + 7 dagen, roept `getAllEvents(monday, sunday)` aan
- `src/utils-date.js` — `getMonday(date)`: geeft de maandag van de week van `date`
- `src/main.js` — routing: `GET action=week → handleWeek(e.parameter.date)`

## Notities
- Parameter heet `date` (niet `datum`) voor historische consistentie met de OpenAPI-spec
