# Tasks

- [x] 1. Bepaal hoe menu-events te onderscheiden zijn van andere all-day events
         (title-prefix, kalender, of aparte eigenschap)
- [x] 2. Schrijf `handleGetMenu(datum)` in `src/menu.js`
- [x] 3. Voeg routing toe in `src/main.js` (GET, datum-parameter)
- [x] 4. Breid `docs/openapi.yaml` uit (enum + datum-parameter beschrijving)
- [x] 5. Voeg subsectie toe aan `docs/chatgpt-prompt.md`
- [ ] 6. Smoke test: `GET ?action=menu&datum=<datum-met-menu>` → `{ menu: "..." }`
- [ ] 7. Smoke test: `GET ?action=menu&datum=<datum-zonder-menu>` → `{ menu: null }`
- [ ] 8. Smoke test: `GET ?action=menu` (datum ontbreekt) → foutmelding
