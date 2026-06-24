# Technical Plan

## Components
- `src/bezorgservice.js` — `handleDeliveries(datum)`: leest Klanten-tab en
  Bezorgingen-tab via `readRows(openDeliverySheet(), ...)`, filtert klanten op
  weekdag via `scheduleIncludes(client, weekday)`, past afwijkingen toe via
  `exceptionAppliesOn(exception, datum)`, bouwt entries op via `buildDeliveryEntry()`
- `src/main.js` — routing: `GET action=bezorgingen → handleDeliveries(e.parameter.datum)`

## Notities
- Weekdag wordt afgeleid uit de datum (JS `Date.getDay()` → ma/di/.../zo)
- Afwijkingen kunnen zowel op specifieke datum als op weekdag van toepassing zijn
