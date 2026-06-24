# Technical Plan

## Components
- `src/menu.js` — `handleMenu(body)`: valideert `datum` en `menu`, maakt
  all-day event aan via `CalendarApp.createAllDayEvent('Menu', date, { description: 'menu: <tekst>' })`
  in de Taverne-kalender
- `src/main.js` — routing: `POST action=menu → handleMenu(body)`

## Notities
- Titel is altijd `'Menu'` (niet de menutekst zelf); de tekst staat in de
  beschrijving zodat `handleGetMenu` hem uniform kan terugvinden
