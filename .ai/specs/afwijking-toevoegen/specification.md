# Afwijking toevoegen

## Intent
Leg een eenmalige afwijking vast op het standaard bezorgrooster van een klant,
zodat Antje uitzonderingen kan registreren zonder het vaste rooster aan te passen.

## Acceptance criteria
- `POST action=afwijking` met `klant_id`, `datum` (of `weekdag`) en `type` registreert
  de afwijking
- Drie types:
  - `annulering` — klant krijgt die dag niets
  - `wijziging` — klant krijgt iets anders (tijd, porties, bezorgwijze, bezorger, toetje)
  - `extra` — klant krijgt een extra bezorging buiten zijn vaste rooster
- Bij wijziging: alleen afwijkende velden invullen; ongewijzigde velden leeg laten
- `klant_id` en `type` zijn altijd verplicht
- Out of scope: bestaande afwijking aanpassen of verwijderen (zie `afwijking-verwijderen`)
