# Klanten lijst opvragen

## Intent
Geef een overzicht van alle bezorgklanten zodat de GPT namen en IDs kan opzoeken
zonder dat Antje de sheet hoeft te openen.

## Acceptance criteria
- `GET ?action=klanten` geeft een array van alle klanten terug
- Elke klant bevat: `klant_id`, `voornaam`, `achternaam`, `rooster`,
  `vaste_bezorgtijd`, `bezorgwijze`, `actief`, `dieetwensen`, `bezorg_opmerkingen`
- Klanten zijn gesorteerd op achternaam, dan voornaam
- Alle klanten worden teruggegeven (inclusief inactieve), zodat de GPT zelf
  kan filteren op basis van de vraag
- Out of scope: paginering
- Out of scope: zoeken of filteren via queryparameters
