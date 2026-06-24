# Kalender week opvragen

## Intent
Haal alle kalenderitems van een volledige week op zodat de GPT een weekoverzicht
kan geven of de weekexport kan samenstellen.

## Acceptance criteria
- `GET ?action=week&date=YYYY-MM-DD` geeft alle events van maandag t/m zondag
  van de week waar de opgegeven datum in valt
- Response bevat `week_start` (maandag, YYYY-MM-DD) en `entries`
- `date` is verplicht; ontbreekt hij, dan volgt een foutmelding
- Entries hebben hetzelfde formaat als bij `action=today`
- Out of scope: meerdere weken in één aanroep
