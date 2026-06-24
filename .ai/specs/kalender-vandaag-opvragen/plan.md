# Technical Plan

## Components
- `src/calendar.js` — `handleToday()`: bepaalt start/end van de huidige dag,
  roept `getAllEvents(start, end)` aan
- `src/calendar.js` — `getAllEvents(start, end)`: itereert alle drie kalenders via
  `CALENDARS`, haalt events op met `getEvents()`, parseert beschrijvingsvelden
  (key: value per regel), sorteert op datum + begintijd
- `src/main.js` — routing: `GET action=today → handleToday()`

## Notities
- Tijdzone: events worden opgehaald met `getEvents(start, end)`; Apps Script
  gebruikt de tijdzone van het script (Europe/Amsterdam na configuratie)
- Geheel-dag events worden herkend via `event.isAllDayEvent()`
