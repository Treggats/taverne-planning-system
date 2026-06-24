# Kalender vandaag opvragen

## Intent
Haal alle kalenderitems van vandaag op zodat de GPT een overzicht kan geven
van wat er die dag gepland staat, zonder een datum te hoeven opgeven.

## Acceptance criteria
- `GET ?action=today` geeft alle events van de huidige dag terug uit alle drie kalenders
- Response bevat `date` (YYYY-MM-DD) en `entries` (gesorteerde lijst)
- Elk entry heeft: `kalender`, `naam`, `datum`; geheel-dag events hebben `geheel_dag: true`,
  getimede events hebben `begin` en `eind` (HH:MM)
- Beschrijvingsvelden (organisatie, locatie, lunch, etc.) worden als losse velden
  opgenomen als ze aanwezig zijn in de event-beschrijving
- Geen parameters vereist naast het auth-token
