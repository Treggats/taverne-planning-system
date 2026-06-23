# Technical Plan

## Components
- `src/werkrooster.js` — nieuwe `handleWeekClear(body)` functie: zoek alle rijen
  met de opgegeven week, verwijder ze van onderaf (omgekeerde volgorde om
  verschuivende rijnummers te voorkomen)
- `src/main.js` — routing: `if (action === 'week_wissen') return handleWeekClear(body)`
- `docs/openapi.yaml` — nieuw POST-schema `WeekWissen` met `week` en `datum`
- `docs/chatgpt-prompt.md` — subsectie toevoegen aan `## Werkrooster`; GPT vraagt
  altijd bevestiging vóór wissen

## Expliciete afbakening
- Verwijdert alleen rijen uit de Diensten-tab, niet uit Medewerkers
- Verwijderen van onderaf is vereist: Google Sheets verschuift rijnummers na
  deleteRow; van boven naar beneden zou verkeerde rijen raken (zie GOTCHAS.md)

## Afhankelijkheden
- Hergebruikt `normalizeWeek` uit `src/werkrooster.js`
- Hergebruikt `readHeaders` uit `src/utils-sheet.js`
