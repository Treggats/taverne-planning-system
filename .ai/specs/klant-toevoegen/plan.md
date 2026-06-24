# Technical Plan

## Components
- `src/bezorgservice.js` — `handleClient(body)`: valideert verplichte velden,
  bepaalt `klant_id` via `nextClientId()` (hoogste bestaande ID + 1),
  voegt rij toe aan Klanten-tab
- `src/bezorgservice.js` — `nextClientId()`: leest Klanten-tab, geeft
  `max(klant_id) + 1` terug
- `src/main.js` — routing: `POST action=klant → handleClient(body)`

## Notities
- Tijdelijke IDs 9001–9006 zijn seed-data; echte klanten krijgen lagere nummers
  (Antje vervangt de tijdelijke IDs handmatig)
