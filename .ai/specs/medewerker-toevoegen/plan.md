# Technical Plan

## Components
- `src/werkrooster.js` — `handleEmployee(body)`: valideert `naam` en `type`,
  zoekt bestaande rij via `findEmployeeRow(sheet, naam)`,
  upsert: bestaand → rij overschrijven, nieuw → `appendRow()` met `actief: ja`
- `src/werkrooster.js` — `findEmployeeRow(sheet, naam)`: zoekt op naam in Medewerkers-tab
- `src/main.js` — routing: `POST action=medewerker → handleEmployee(body)`
