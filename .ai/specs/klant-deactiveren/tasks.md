# Tasks

- [ ] 1. Schrijf `findClientRow(sheet, headers, klantId)` in `src/bezorgservice.js`
- [ ] 2. Schrijf `handleClientStatus(body)` — valideer klant_id en actief-waarde,
         zoek rij op, update actief-kolom
- [ ] 3. Voeg routing toe in `src/main.js`
- [ ] 4. Voeg `KlantStatus`-schema toe aan `docs/openapi.yaml`
- [ ] 5. Voeg subsectie toe aan `docs/chatgpt-prompt.md` inclusief bevestigingsstap
- [ ] 6. Smoke test: deactiveer een bestaande klant → klant ontbreekt op bezorglijst
- [ ] 7. Smoke test: reactiveer diezelfde klant → klant verschijnt weer op bezorglijst
- [ ] 8. Smoke test: onbekend klant_id → foutmelding
- [ ] 9. Smoke test: ongeldige actief-waarde → foutmelding
