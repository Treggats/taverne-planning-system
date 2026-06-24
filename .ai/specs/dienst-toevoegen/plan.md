# Technical Plan

## Components
- `src/werkrooster.js` — `handleShift(body)`: normaliseert week/datum,
  zoekt bestaande rij via `findShiftRow(sheet, week, weekday, naam)`,
  upsert: bestaand → rij overschrijven, nieuw → `appendRow()`
- `src/werkrooster.js` — `findShiftRow(sheet, week, weekday, naam)`:
  zoekt op samengestelde sleutel week + weekdag + naam
- `src/main.js` — routing: `POST action=dienst → handleShift(body)`
