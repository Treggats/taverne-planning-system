# Technical Plan

## Components
- `src/bezorgservice.js` — nieuwe `handleListClients()` functie: leest Klanten-tab,
  selecteert relevante velden, sorteert op achternaam/voornaam
- `src/main.js` — routing: `if (action === 'klanten') return handleListClients()`
- `docs/openapi.yaml` — `klanten` toevoegen aan de GET action enum
- `docs/chatgpt-prompt.md` — subsectie "Klanten lijst opvragen" toevoegen aan
  `## Bezorgservice`

## Afhankelijkheden
- Hergebruikt `readRows(openDeliverySheet(), 'Klanten')` — patroon identiek aan
  `handleListEmployees()` in `src/werkrooster.js`
- Geen nieuwe sheet-kolommen nodig
