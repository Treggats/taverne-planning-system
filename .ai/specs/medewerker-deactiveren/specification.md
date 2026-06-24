# Medewerker deactiveren

## Intent
Stel een medewerker in op inactief zodat hij niet meer als optie verschijnt bij
het inplannen van diensten, zonder de medewerker te verwijderen.

## Acceptance criteria
- `POST action=medewerker` met `naam` en `actief=nee` zet een bestaande medewerker
  op inactief (dit werkt technisch al — dit spec formaliseert het GPT-gedrag)
- De GPT vraagt altijd bevestiging vóór het deactiveren ("Weet je zeker...?")
- Na deactiveren is de medewerker nog zichtbaar via `GET action=medewerkers`
  (met `actief: nee`), maar de GPT suggereert hem niet meer bij het plannen
- Reactiveren werkt met `actief=ja`
- Out of scope: medewerker permanent verwijderen uit de sheet
- Out of scope: automatisch openstaande diensten van de medewerker wissen
