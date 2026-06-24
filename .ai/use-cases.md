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
| Medewerker inactiveren (GPT-gedrag) | `POST action=medewerker` + `actief=nee`; GPT vraagt bevestiging en filtert inactief |

## Bewust niet gedekt

| Use case | Reden |
|---|---|
| Bestaande kalender entry aanpassen | Toestemmingsregel: alleen Antje/Tonko |
| Bestaande kalender entry verwijderen | Toestemmingsregel: alleen Antje/Tonko |
| Bestaande klant aanpassen (rooster, telefoon, …) | Antje of Tonko doen dit zelf in de sheet |
| Bestaande afwijking verwijderen | Antje of Tonko doen dit zelf in de sheet |

## Nog niet gebouwd

Specs staan in `.ai/specs/`.

| Use case | Spec | Wat ontbreekt |
|---|---|---|
| Menu opvragen | `specs/menu-opvragen/` | `GET action=menu&datum=YYYY-MM-DD` — handler + routing + OpenAPI + GPT-prompt |
| Klanten lijst opvragen | `specs/klanten-lijst-opvragen/` | `GET action=klanten` — handler + routing + OpenAPI + GPT-prompt |
| Klant inactiveren | `specs/klant-inactiveren/` | `POST action=klant_status` — nieuwe action, handler + routing + OpenAPI + GPT-prompt |
| Werkrooster week wissen | `specs/werkrooster-week-wissen/` | `POST action=week_wissen` — handler (rijen bottom-up verwijderen) + routing + OpenAPI + GPT-prompt |
