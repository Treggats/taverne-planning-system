# Taverne Planning

Planningssysteem voor Antje's Taverne / Jules huiskamer in Assen.
Eindgebruiker: Antje Dijkstra (antjec.dijkstra@gmail.com).
Beheerder: Tonko Mulder (tonko.mulder@gmail.com).

## Werkwijze
Voer geen taken uit tenzij expliciet gevraagd. Stel voor, implementeer niet.
Ruim planbestanden op na een sessie zodat ze niet als impliciete taakopdracht
worden opgepikt bij de volgende sessie.

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
Sheet ID: `19qx7Or__9pwEp6KtMjLmm7Hq1Nc0hM0Rghd5VV0U9Pc`
Tabs: Klanten | Bezorgingen
Schema Klanten: klant_id, voornaam, achternaam, adres, telefoon,
  vaste_bezorgtijd, bezorg_opmerkingen, dieetwensen, actief
Tijdelijke IDs 9001–9006 vervangen door echte nummers via Antje.

## Referenties
Gebruik `/kalenders` voor de volledige kalenderindeling.
Gebruik `/scripts` voor Apps Script en OpenAPI schema.
