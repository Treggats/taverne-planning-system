# Technical Plan

## Components
- `src/calendar.js` — `buildRecurrence(herhaling, herhaling_tot)`: maakt een
  `CalendarApp.newRecurrence()` met de juiste regel (`addDailyRule`,
  `addWeeklyRule`, `addWeeklyRule().interval(2)`, `addMonthlyRule`);
  voegt `until(date)` toe als `herhaling_tot` opgegeven is
- `src/calendar.js` — `handleCreate(body)`: detecteert `body.herhaling`,
  roept `buildRecurrence()` aan en gebruikt `createEventSeries` of
  `createAllDayEventSeries` i.p.v. de enkelvoudige varianten

## Notities
- Tweewekelijks met `interval(2)` behoudt de pariteit van de startdatum —
  oneven/even week blijft correct door de looptijd heen
