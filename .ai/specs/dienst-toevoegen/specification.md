# Dienst toevoegen of wijzigen

## Intent
Voeg een werkdienst toe voor één persoon op één dag, of overschrijf een
bestaande dienst als die persoon die dag al ingepland stond.

## Acceptance criteria
- `POST action=dienst` met `naam`, `weekdag` (of `datum`), `begin` en `eind`
  voegt de dienst toe of werkt hem bij
- Eén dienst = één persoon op één weekdag in één week
- Bestaat er al een dienst voor die combinatie (naam + weekdag + week),
  dan wordt die overschreven
- `naam`, weekdag/datum en `begin` zijn verplicht
- `eind` is optioneel
- Out of scope: meerdere diensten per persoon per dag
