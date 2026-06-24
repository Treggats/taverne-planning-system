# Taverne Planning

Planningssysteem voor Antje's Taverne / Jules huiskamer in Assen.
Eindgebruiker: Antje Dijkstra (antjec.dijkstra@gmail.com).
Beheerder: Tonko Mulder (tonko.mulder@gmail.com).

## Werkwijze
Voer geen taken uit tenzij expliciet gevraagd. Stel voor, implementeer niet.
Ruim planbestanden op na een sessie zodat ze niet als impliciete taakopdracht
worden opgepikt bij de volgende sessie.

## Git
Pull requests altijd mergen met `merge_method: rebase`. Nooit squash, nooit merge commit.

## Toestemmingsregel
Nieuwe calendar events aanmaken mag altijd. Bestaande events nooit aanpassen
of verwijderen zonder expliciete toestemming van Antje of Tonko.
Originele weekplanningen in Google Drive: alleen lezen, nooit aanpassen.

## Architectuur
1. Google Calendar — 3 kalenders in Antje's account
2. Google Apps Script — REST tussenlaag voor ChatGPT
3. Custom GPT (ChatGPT Plus) — interface voor Antje

## Kalenders
| Sleutel | Naam | Inhoud |
|---|---|---|
| `taverne` | Taverne | Cosis, KOSKAMP, FNV, vergaderingen, Beweegtuin, Mijn Buurt Assen, container (oneven weken) |
| `mspa` | MSPA | Sjoelen, rummicub, circus, ExpresZo. Ook aangeduid als MSP. |
| `jules` | Jules Huiskamer | Koffie, openingstijden, COC, Regenboog Café, Zonder Stempel |

Ruimtes Taverne: 400m, TT, Renners, Dug Out, Ballo.
LHBTIQ-avonden met betaald eten → ook entry in Taverne.

## Lunch
Standaard: A+B+fruit (A=warm, B=gehaktballen). Alleen afwijkingen vermelden.
Apps Script schrijft `lunch: ja` automatisch om naar `lunch: A+B+fruit`.

## Google Drive
Map Weekplanningen ID: `1HNs0w_MOtTSbgI4XekNuZTnoIHvX9sK1`

## Bezorgservice
Sheet ID: `1jfc7e2tmv5FDzZMOVXSGMmu14TQ5wIGhg87hRq7FmJ8`
Tabs: Klanten | Bezorgingen
Schema Klanten: klant_id, voornaam, achternaam, adres, telefoon,
  vaste_bezorgtijd, bezorg_opmerkingen, dieetwensen, actief
Tijdelijke IDs 9001–9006 vervangen door echte nummers via Antje.

## Werkrooster
Sheet ID: `1Cymrle7EpkrLZrvPlUP2Ktm4aE7zBuMDcxjuJlGdmH4`
Tabs: Medewerkers | Diensten

## Referenties
Gebruik `/kalenders` voor de volledige kalenderindeling.
Gebruik `/scripts` voor Apps Script en OpenAPI schema.
Specs en beslisdocumenten staan in `.ai/` (use-cases, council-deliberaties, per-feature specs).
