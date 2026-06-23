# Technical Plan

## Components
- `src/menu.js` — nieuwe `handleGetMenu(datum)` functie: zoek all-day events op
  de opgegeven datum in de Taverne-kalender, filter op menu-events, geef tekst terug
- `src/main.js` — routing: `if (action === 'menu' && e.parameter.datum)` vóór de
  bestaande POST-afhandeling (of aparte GET-check)
- `docs/openapi.yaml` — `menu` toevoegen aan de GET action enum + `datum`-parameter
  documenteren
- `docs/chatgpt-prompt.md` — subsectie "Menu opvragen" toevoegen aan `## Menu`

## Afhankelijkheden
- Hergebruikt `parseDate` uit `src/utils-date.js`
- Hergebruikt de bestaande Calendar-toegang uit `src/calendar.js` (patroon voor
  het opvragen van events op een dag)
- Menu-events zijn all-day events in de Taverne-kalender; de exacte filterstrategie
  (op title-prefix of op een vaste eigenschap) moet bepaald worden bij implementatie
