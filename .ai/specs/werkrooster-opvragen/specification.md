# Werkrooster opvragen

## Intent
Haal het personeelsrooster op voor een specifieke week zodat Antje weet wie
wanneer werkt, zonder de sheet te hoeven openen.

## Acceptance criteria
- `GET ?action=werkrooster&datum=YYYY-MM-DD` of `&week=YYYY-WW` geeft alle
  diensten van die week terug
- Response bevat `week` (YYYY-WW) en `diensten` (lijst van diensten)
- Elke dienst heeft: `naam`, `weekdag`, `begin`, `eind`
- Resultaat is gesorteerd op weekdag en begintijd
- Het systeem bepaalt zelf het ISO-weeknummer — de GPT hoeft geen weeknummers
  te berekenen
- `datum` en `week` zijn alternatief; ontbreken beide → foutmelding
