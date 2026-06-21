# Taverne Planning

Planningssysteem voor Antje's Taverne en Jules Huiskamer in Assen.

## Architectuur

```
Custom GPT (Antje's ChatGPT)
    ↓ OpenAPI v3.0.0
Google Apps Script (REST tussenlaag)
    ↓
Google Calendar (3 kalenders) + Google Sheets (bezorgservice, werkrooster)
```

## Kalenders

| Sleutel | Naam | Voorbeelden |
|---|---|---|
| `taverne` | Taverne | Cosis, KOSKAMP, FNV, Beweegtuin, vergaderingen |
| `mspa` | MSPA | Sjoelen, rummicub, circus, ExpresZo |
| `jules` | Jules Huiskamer | Koffie, COC, Regenboog Café, Zonder Stempel |

## Bestanden

### Apps Script broncode (`src/`)

| Bestand | Inhoud |
|---|---|
| `src/config.js` | Constanten (tokens, kalenders, sheet IDs) |
| `src/utils-date.js` | Datum/tijd helpers |
| `src/utils-http.js` | Authenticatie en JSON response |
| `src/utils-sheet.js` | Generieke spreadsheet helpers |
| `src/calendar.js` | Kalender lezen en schrijven |
| `src/menu.js` | Menu-events |
| `src/bezorgservice.js` | Bezorgservice (klanten, bezorgingen, afwijkingen) |
| `src/werkrooster.js` | Werkrooster (diensten, medewerkers) |
| `src/main.js` | GAS entry points `doGet` / `doPost` |
| `appsscript.json` | GAS manifest met `filePushOrder` |

### Overige bestanden

| Bestand | Inhoud |
|---|---|
| `docs/apps-script-calendar.js` | Originele monolithische broncode (archief) |
| `docs/openapi.yaml` | OpenAPI schema voor Custom GPT action |
| `docs/chatgpt-prompt.md` | Systeemprompt voor het Custom GPT |
| `docs/kalenders.md` | Volledige kalenderindeling met alle activiteiten |
| `scripts/build_bezorgservice.py` | Genereert de bezorgservice sheet |
| `scripts/build_werkrooster.py` | Genereert de werkrooster sheet |

## Endpoints

**GET**
- `?action=today` — kalender entries van vandaag
- `?action=week&date=YYYY-MM-DD` — kalender entries voor de week van die datum
- `?action=bezorgingen&datum=YYYY-MM-DD` — dagelijkse bezorglijst
- `?action=werkrooster&datum=YYYY-MM-DD` — personeelsrooster voor de week van die datum

**POST** (veld `action` bepaalt het type)
- `kalender_event` — nieuw kalender event
- `menu` — all-day event "Menu" in de Taverne kalender
- `afwijking` — annulering, wijziging of extra bezorging
- `klant` — nieuwe bezorgservice klant
- `dienst` — werkdienst toevoegen, wijzigen of verwijderen
- `week_kopieer` — kopieer een week als startpunt voor de volgende
- `medewerker` — medewerker toevoegen of bijwerken

## Productie-migratie

Systeem draait momenteel in Tonko's account (test). Migratie naar Antje's
account: zie `STATUS.md` voor de stap-voor-stap checklist.

## Contacten

- Eindgebruiker: Antje Dijkstra (antjec.dijkstra@gmail.com)
- Beheerder: Tonko Mulder (tonko.mulder@gmail.com)
