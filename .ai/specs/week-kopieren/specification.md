# Week kopiëren

## Intent
Kopieer het werkrooster van een bestaande week naar een nieuwe week als
startpunt, zodat Antje niet elke week van nul hoeft te beginnen.

## Acceptance criteria
- `POST action=week_kopieer` met `van_datum`/`van` en `naar_datum`/`naar` kopieert
  alle diensten van de bronweek naar de doelweek
- De doelweek moet leeg zijn; bestaat er al een rooster → foutmelding
- `van_datum` en `naar_datum` zijn YYYY-MM-DD (datum in de betreffende week);
  alternatief: `van` en `naar` als YYYY-WW
- Na kopiëren kunnen individuele diensten aangepast worden via `POST action=dienst`
- Out of scope: gedeeltelijk kopiëren (altijd de volledige week)
