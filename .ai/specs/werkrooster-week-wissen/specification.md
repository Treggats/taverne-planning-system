# Werkrooster week wissen

## Intent
Verwijder alle diensten van een opgegeven week zodat het rooster opnieuw
opgebouwd kan worden zonder handmatig regels te hoeven verwijderen.

## Acceptance criteria
- `POST action=week_wissen` met `week` of `datum` wist alle diensten van die week
- Response bevat het aantal verwijderde regels (`gewist: N`)
- Als de week geen diensten bevat, is `gewist: 0` een geldige response (geen fout)
- Week of datum is verplicht; ontbreekt beide, dan volgt een foutmelding
- Out of scope: gedeeltelijk wissen (bijv. alleen één weekdag)
- Out of scope: wissen van medewerkers uit de Medewerkers-tab
