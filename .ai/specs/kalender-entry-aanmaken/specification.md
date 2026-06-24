# Kalender entry aanmaken

## Intent
Maak een nieuw event aan in één van de drie kalenders zodat Antje via de GPT
activiteiten kan inplannen zonder Google Calendar te hoeven openen.

## Acceptance criteria
- `POST action=kalender_event` met `kalender`, `datum` en `naam` maakt een event aan
- Geen `begin` → heel-dag event
- `begin` zonder `eind` → event van 1 uur
- `begin` + `eind` → event met opgegeven tijden
- Optionele velden worden als beschrijvingsregels opgeslagen:
  `organisatie`, `locatie`, `aantal`, `lunch`, `notities`
- `lunch: ja` wordt automatisch omgezet naar `lunch: A+B+fruit`
- Onbekende kalender → foutmelding
- Out of scope: bestaand event aanpassen of verwijderen
