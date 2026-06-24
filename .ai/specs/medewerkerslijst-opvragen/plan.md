# Technical Plan

## Components
- `src/werkrooster.js` — `handleListEmployees()`: leest Medewerkers-tab via
  `readRows(openScheduleSheet(), 'Medewerkers')`, filtert lege naam-rijen weg,
  sorteert op naam, geeft `{ medewerkers: [...] }` terug
- `src/main.js` — routing: `GET action=medewerkers → handleListEmployees()`

## Notities
- Geeft alle medewerkers terug (ook inactieve); de GPT filtert zelf op actief
  bij dienst-gerelateerde vragen
