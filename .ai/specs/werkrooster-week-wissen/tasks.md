# Tasks

- [ ] 1. Schrijf `handleWeekClear(body)` in `src/werkrooster.js`:
         valideer week/datum, verzamel rijnummers (van onderaf), verwijder ze
- [ ] 2. Voeg routing toe in `src/main.js`
- [ ] 3. Voeg `WeekWissen`-schema toe aan `docs/openapi.yaml`
- [ ] 4. Voeg subsectie toe aan `docs/chatgpt-prompt.md` inclusief bevestigingsstap
- [ ] 5. Smoke test: wis een week met diensten → `{ gewist: N }` met N > 0;
         vervolgaanroep `GET action=werkrooster` geeft lege lijst
- [ ] 6. Smoke test: wis een lege week → `{ gewist: 0 }`
- [ ] 7. Smoke test: week en datum beide leeg → foutmelding
