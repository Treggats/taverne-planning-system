# Taverne Planning

Planningssysteem voor Antje's Taverne en Jules Huiskamer in Assen.

## Architectuur

```
Custom GPT (Antje's ChatGPT)
    ↓ OpenAPI v3.0.0
Google Apps Script (REST tussenlaag)
    ↓
Google Calendar (3 kalenders) + Google Sheets (bezorgservice)
```

## Kalenders

| Sleutel | Naam | Voorbeelden |
|---|---|---|
| `taverne` | Taverne | Cosis, KOSKAMP, FNV, Beweegtuin, vergaderingen |
| `mspa` | MSPA | Sjoelen, rummicub, circus, ExpresZo |
| `jules` | Jules Huiskamer | Koffie, COC, Regenboog Café, Zonder Stempel |

## Bestanden

| Bestand | Inhoud |
|---|---|
| `docs/apps-script-calendar.js` | Apps Script broncode (REST API) |
| `docs/openapi.yaml` | OpenAPI schema voor Custom GPT action |
| `docs/chatgpt-prompt.md` | Systeemprompt voor het Custom GPT |
| `docs/kalenders.md` | Volledige kalenderindeling met alle activiteiten |
| `scripts/build_bezorgservice.py` | Script om de bezorgservice v2 sheet te genereren |

## Endpoints

**GET**
- `?action=today` — kalender entries van vandaag
- `?action=week&date=YYYY-MM-DD` — kalender entries voor de week van die datum
- `?action=bezorgingen&datum=YYYY-MM-DD` — dagelijkse bezorglijst

**POST** (veld `action` bepaalt het type)
- `kalender_event` — nieuw kalender event met tijden
- `menu` — all-day event "Menu" in de Taverne kalender
- `afwijking` — annulering, wijziging of extra bezorging
- `klant` — nieuwe bezorgservice klant

## Productie-migratie

Systeem draait momenteel in Tonko's account (test). Migratie naar Antje's
account: zie `STATUS.md` voor de stap-voor-stap checklist.

## Contacten

- Eindgebruiker: Antje Dijkstra (antjec.dijkstra@gmail.com)
- Beheerder: Tonko Mulder (tonko.mulder@gmail.com)
