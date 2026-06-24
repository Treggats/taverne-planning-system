# Menu toevoegen

## Intent
Sla het dagmenu op als kalender-event zodat het via de bezorgservice en de GPT
opvraagbaar is en in de weekplanning verschijnt.

## Acceptance criteria
- `POST action=menu` met `datum` en `menu` maakt een all-day event aan in de
  Taverne-kalender
- Het event heeft titel `'Menu'` en beschrijving `menu: <tekst>`
- `datum` en `menu` zijn verplicht; ontbreekt één van beide → foutmelding
- De menutekst is vrije tekst (bijv. "aardappel, broccoli, sukade")
- Out of scope: bestaand menu-event aanpassen of verwijderen
