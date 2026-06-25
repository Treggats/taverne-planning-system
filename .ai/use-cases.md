# Use case dekking

## Gedekt

| Use case | Endpoint |
|---|---|
| Kalender vandaag opvragen | `GET action=today` |
| Kalender week opvragen | `GET action=week&date=YYYY-MM-DD` |
| Kalender entry aanmaken | `POST action=kalender_event` |
| Terugkerende afspraak aanmaken | `POST action=kalender_event` + `herhaling` |
| Menu toevoegen | `POST action=menu` |
| Bezorglijst opvragen | `GET action=bezorgingen&datum=YYYY-MM-DD` |
| Afwijking toevoegen (annulering / wijziging / extra) | `POST action=afwijking` |
| Nieuwe klant toevoegen | `POST action=klant` |
| Werkrooster opvragen | `GET action=werkrooster&datum=YYYY-MM-DD` |
| Dienst toevoegen of wijzigen | `POST action=dienst` |
| Dienst verwijderen | `POST action=dienst` (begin leeg) |
| Week kopiëren | `POST action=week_kopieer` |
| Nieuwe medewerker toevoegen | `POST action=medewerker` |
| Medewerkerslijst opvragen | `GET action=medewerkers` |
| Medewerker deactiveren (GPT-gedrag) | `POST action=medewerker` + `actief=nee`; GPT vraagt bevestiging en filtert inactief |
| Menu opvragen | `GET action=menu&datum=YYYY-MM-DD` |
| Klanten lijst opvragen | `GET action=klanten` |
| Klant deactiveren | `POST action=klant_status` met `actief=ja/nee` |
| Werkrooster week wissen | `POST action=week_wissen` |
| Afwijking verwijderen | `POST action=afwijking_verwijderen` |
| Weekplanning exporteren naar Google Sheets | `POST action=week_export` met `datum` of `week` |

## Bewust niet gedekt

| Use case | Reden |
|---|---|
| Bestaande kalender entry aanpassen | Toestemmingsregel: alleen Antje/Tonko |
| Bestaande kalender entry verwijderen | Toestemmingsregel: alleen Antje/Tonko |
| Bestaande klant aanpassen (rooster, telefoon, …) | Antje of Tonko doen dit zelf in de sheet |
