# Terugkerende afspraak aanmaken

## Intent
Maak een reeks terugkerende events aan via één API-aanroep zodat wekelijkse
of maandelijkse activiteiten niet handmatig herhaald hoeven te worden.

## Acceptance criteria
- `POST action=kalender_event` met `herhaling` maakt een event-reeks aan
- Toegestane waarden: `dagelijks`, `wekelijks`, `tweewekelijks`, `maandelijks`
- De weekdag/dag volgt uit `datum` — voor "elke dinsdag" kies je een dinsdag + `wekelijks`
- Optioneel `herhaling_tot` (YYYY-MM-DD) beëindigt de reeks op die datum;
  weglaten = de reeks loopt door
- "Oneven weken" (bijv. container): kies een datum in een oneven week + `tweewekelijks`
- Alle overige velden (locatie, lunch, etc.) werken identiek aan een eenmalig event
- Out of scope: een bestaande reeks aanpassen of verwijderen
