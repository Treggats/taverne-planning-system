# Technical Plan

## Components
- `src/werkrooster.js` — `handleShift(body)`: als `body.begin` leeg of afwezig
  is, zoekt `findShiftRow()` de rij op en roept `deleteRow()` aan;
  geeft `{ success: true, deleted: true/false }` terug
- Geen aparte handler nodig — het verwijderpad zit in dezelfde `handleShift()`
  als het upsert-pad
