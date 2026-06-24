# Afwijking verwijderen

## Intent
Verwijder een eerder vastgelegde afwijking (annulering, wijziging of extra) voor
een bezorgklant, zodat op die dag weer het standaard rooster geldt.

## Acceptance criteria
- `DELETE action=afwijking` met `klant_id` en `datum` verwijdert de bijbehorende
  afwijkingsrij uit de sheet
- Als geen afwijking bestaat voor die klant op die datum, volgt een neutrale
  response (`deleted: false`), geen foutmelding
- Na verwijderen verschijnt de klant weer op de bezorglijst zoals het rooster
  voorschrijft (`GET action=bezorgingen` geeft de standaardbezorging terug)
- De GPT vraagt altijd bevestiging vóór verwijderen
- Out of scope: meerdere afwijkingen tegelijk verwijderen
- Out of scope: afwijkingen op weekdag-niveau verwijderen (alleen datum)
