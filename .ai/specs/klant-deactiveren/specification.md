# Klant deactiveren

## Intent
Stel een bezorgklant tijdelijk of permanent in op inactief zodat hij niet meer
op de bezorglijst verschijnt, zonder de klantgegevens te verwijderen.

## Acceptance criteria
- `POST action=klant_status` met `klant_id` en `actief` (`ja`/`nee`) past de
  status aan van een bestaande klant
- Als `klant_id` niet bestaat, volgt een foutmelding
- Na deactiveren verschijnt de klant niet meer op bezorglijsten
  (`GET action=bezorgingen`)
- Reactiveren werkt met dezelfde aanroep (`actief=ja`)
- Out of scope: andere klantgegevens aanpassen (rooster, tijden, adres)
- Out of scope: klant permanent verwijderen
