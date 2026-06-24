# Dienst verwijderen

## Intent
Verwijder een ingeplande dienst van een medewerker op een specifieke dag,
zodat correcties in het rooster mogelijk zijn.

## Acceptance criteria
- `POST action=dienst` met `naam`, weekdag/datum en een lege `begin` verwijdert
  de dienst
- Als er geen dienst bestaat voor die combinatie, volgt een neutrale response
  (`deleted: false`), geen foutmelding
- Hetzelfde endpoint als "dienst toevoegen" — leeg `begin` is het verwijdersignaal
