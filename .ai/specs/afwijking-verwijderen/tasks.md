# Tasks

- [x] 1. Schrijf `handleDeleteException(body)` in `src/bezorgservice.js` — valideer
         klant_id en datum, zoek rij op, verwijder hem
- [x] 2. Voeg routing toe in `src/main.js`:
         `if (action === 'afwijking_verwijderen') return handleDeleteException(body)`
- [x] 3. Voeg `AfwijkingVerwijderen`-schema toe aan `docs/openapi.yaml`
- [x] 4. Voeg subsectie toe aan `docs/chatgpt-prompt.md` met bevestigingsstap
- [ ] 5. Smoke test: verwijder een bestaande afwijking → klant staat weer op
         bezorglijst met standaardrooster
- [ ] 6. Smoke test: verwijder op datum zonder afwijking → `{ deleted: false }`,
         geen fout
- [ ] 7. Smoke test: onbekend klant_id → foutmelding
