# Klant toevoegen

## Intent
Registreer een nieuwe bezorgklant met zijn vaste bezorgrooster zodat hij
automatisch in de dagelijkse bezorglijst verschijnt.

## Acceptance criteria
- `POST action=klant` met minimaal `voornaam`, `rooster`, `vaste_bezorgtijd`
  en `bezorgwijze` registreert de klant
- `klant_id` wordt automatisch toegekend (volgnummer op basis van bestaande klanten)
- Optioneel: `achternaam`, `adres`, `telefoon`, `porties` (default 1),
  `vast_toetje` (default nee), `dieetwensen`, `bezorg_opmerkingen`
- Na aanmaken verschijnt de klant in de bezorglijst op zijn roosterdagen
- Out of scope: bestaande klantgegevens aanpassen (doet Antje/Tonko zelf in de sheet)
