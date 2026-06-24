# Tasks

## Iteratie 1 — zonder Werkrooster-tab

- [ ] 1. Voeg `EXPORT_TEMPLATE_ID` en `WEEKPLANNINGEN_FOLDER_ID` toe aan `src/config.js`
- [ ] 2. Maak `src/export.js` aan met:
         - `handleWeekExport(body)` — hoofdfunctie
         - `weekDates(weekLabel)` — geeft 7 Date-objecten terug (ma t/m zo)
         - `fillGegevensTab(sheet, dates)` — vult A2:A8
         - `fillPlanningTab(sheet, weekLabel, dates)` — vult Planning-tab
         - `fillBestellingTab(sheet, weekLabel, dates)` — vult Bestelling-tab
         - `fillDagTab(sheet, date)` — kopieert Dag template, vult per dag
- [ ] 3. Voeg routing toe in `src/main.js`: `POST action=week_export`
- [ ] 4. Voeg `week_export` toe aan `docs/openapi.yaml`
- [ ] 5. Vervang `## Weekexport` in `docs/chatgpt-prompt.md` door één-commando beschrijving
- [ ] 6. Smoke test: export aanmaken → sheet in Drive met naam `weekplanning-<jaar>-<week>`
- [ ] 7. Smoke test: Planning-tab bevat kalenderitems op de juiste dag
- [ ] 8. Smoke test: Bestelling-tab toont alle klanten met juiste dagkolommen
- [ ] 9. Smoke test: dag-tabs bevatten bezorgingen gesorteerd op tijd
- [ ] 10. Smoke test: zelfde week nogmaals exporteren → foutmelding

## Iteratie 2 — Werkrooster-tab (later)

- [ ] 11. Kolomindeling Werkrooster-tab vaststellen (screenshot van template)
- [ ] 12. `fillWerkroosterTab(sheet, weekLabel)` implementeren
- [ ] 13. Smoke test: Werkrooster-tab gevuld met diensten van die week
