# Technical Plan

## Components
- `src/bezorgservice.js` — `handleException(body)`: valideert `klant_id` en `type`,
  voegt rij toe aan de Bezorgingen-tab via `openDeliverySheet().getSheetByName('Bezorgingen').appendRow()`
- `src/main.js` — routing: `POST action=afwijking → handleException(body)`

## Notities
- Afwijkingen worden als losse rijen opgeslagen; `handleDeliveries` past ze toe
  bij het opvragen van de bezorglijst
- `datum` en `weekdag` zijn alternatieve velden — datum voor eenmalig,
  weekdag voor terugkerend (op basis van hoe `exceptionAppliesOn` werkt)
