# Handoff – Taverne Planning System

Gebruik dit bestand als startpunt voor een nieuwe Claude Code sessie.
Plak de inhoud hieronder als eerste bericht, of verwijs ernaar met `/init`.

---

## Project

**Repo:** `Treggats/taverne-planning-system`  
**Doel:** Planningssysteem voor Antje's Taverne / Jules Huiskamer in Assen.  
**Stack:** Google Apps Script (REST-laag) + Google Sheets + Custom GPT (ChatGPT Plus).  
**Eindgebruiker:** Antje Dijkstra. Beheerder: Tonko Mulder (tonko@tonkomulder.nl).

Architectuur:
1. Google Calendar (3 kalenders in Antje's account)
2. Google Apps Script — REST tussenlaag, deployed als Web App
3. Custom GPT — interface voor Antje

---

## Bestandsstructuur (src/)

```
src/
  config.js        – constanten: AUTH_TOKEN, sheet-IDs, WEEKDAYS, enum-waarden
  main.js          – doGet / doPost routing
  calendar.js      – handleToday, handleWeek, handleCreate
  menu.js          – handleMenu
  bezorgservice.js – handleDeliveries, handleException, handleClient
  werkrooster.js   – handleSchedule, handleShift, handleWeekCopy, handleEmployee
  utils-sheet.js   – readRows, readHeaders, zipRow
  utils-date.js    – parseDate, toDate, asTimeString
  utils-http.js    – response()
docs/
  chatgpt-prompt.md  – systeemprompt voor de Custom GPT (inclusief weekexport-sectie)
  openapi.yaml       – OpenAPI 3.1 schema voor de GPT-actions
  smoke-tests.md     – 12 smoke tests met GPT-prompts voor alle endpoints
  kalenders.md       – volledige kalenderindeling
scripts/
  build_bezorgservice.py  – eenmalig: genereert lege Excel voor bezorgservice sheet
  build_werkrooster.py    – eenmalig: genereert lege Excel voor werkrooster sheet
```

---

## API-endpoints (samenvatting)

| Methode | action | Parameters | Functie |
|---|---|---|---|
| GET | `today` | — | Kalenderentries van vandaag |
| GET | `week` | `date` (YYYY-MM-DD) | Kalenderentries voor de week |
| GET | `bezorgingen` | `datum` (YYYY-MM-DD) | Bezorglijst voor één dag |
| GET | `werkrooster` | `week` of `datum` | Personeelsrooster voor één week |
| POST | `kalender_event` | zie openapi.yaml | Nieuw calendar event |
| POST | `menu` | `datum`, `menu` | Menu als all-day event |
| POST | `afwijking` | `klant_id`, `type`, `datum`/`weekdag` | Bezorgafwijking |
| POST | `klant` | zie openapi.yaml | Nieuwe bezorgklant |
| POST | `dienst` | `weekdag`, `naam`, `begin`/`eind` | Werkdienst upsert/delete |
| POST | `week_kopieer` | `van`/`van_datum`, `naar`/`naar_datum` | Kopieer werkrooster |
| POST | `medewerker` | `naam`, `type`, `actief` | Medewerker upsert |

Authenticatie: `token`-parameter in query (GET) of body (POST).  
Config: `src/config.js` — `AUTH_TOKEN` en `URL` (deployed Web App URL).

---

## Google Sheets

| Sheet | ID | Tabs |
|---|---|---|
| Bezorgservice | `1r5i_SUqkW1FnV2jlVcAMumQZVMJMUWWTul0Cxo_WPjI` | Klanten, Afwijkingen |
| Werkrooster | `VUL_WERKROOSTER_SHEET_ID_IN` (nog in te vullen) | Medewerkers, Diensten |
| Template Weekplanning | `1TANXejPS95x2z5rwKlOmelQmSj5-73rkzmqBMJAi7W0` | gegevens, Planning, Werkrooster, Bestelling, Maandag t/m Zondag |

---

## Beslissingen (zie BESLISSINGEN.md voor details)

- **Werkrooster = weeksnap**: geen basisrooster + afwijkingen, maar elke week opnieuw invullen.
- **API-veldnamen zijn Nederlands**: ze koppelen direct aan Google Sheet kolomnamen (`headers.map(h => body[h])`). Hernoemen vereist ook de sheet aanpassen.
- **Interne identifiers zijn Engels**: functies, variabelen, constanten in de JS-code.
- **Bezorglogica zit in Apps Script**, niet in de GPT.
- **Exportfunctie**: weekplanning genereren via GPT-prompt (instructies in `chatgpt-prompt.md`, sectie `## Weekexport`).

---

## Git-staat

**Main is up to date.** Gemergte PRs (chronologisch):
- PR #3 – src/ file-per-feature structuur
- PR #4 – readSheetRows → readRows (utils-sheet.js)
- PR #2 – werkrooster-beheer (handleSchedule, handleShift, handleWeekCopy, handleEmployee)
- PR #5 – hernoem Nederlandse identifiers naar Engels
- PR #6 – docs/smoke-tests.md (12 smoke tests)

**Open PR:**
- **PR #7** (`docs/export-prompt` → main) — voegt `## Weekexport` sectie toe aan `chatgpt-prompt.md`
  - URL: https://github.com/Treggats/taverne-planning-system/pull/7
  - Status: klaar voor merge

**Branches (kunnen opgeruimd worden na merge PR #7):**
- `origin/docs/export-prompt` — PR #7
- `origin/docs/smoke-tests` — gemerged in main
- `origin/feat/werkrooster-beheer` — gemerged in main
- `origin/refactor/bezorgservice-read-rows` — gemerged in main
- `origin/refactor/english-identifiers` — gemerged in main
- `origin/claude/gas-codebase-refactor-q8p3rb` — werksessie-branch, kan weg

---

## Wat nog openstaat (STATUS.md)

1. **PR #7 mergen** — weekexport in chatgpt-prompt.
2. **SCHEDULE_SHEET_ID invullen** — `src/config.js` regel 11: `VUL_WERKROOSTER_SHEET_ID_IN` vervangen door het echte sheet-ID zodra de werkrooster sheet aangemaakt is.
3. **Werkrooster sheet aanmaken** — eenmalig `scripts/build_werkrooster.py` draaien, resultaat uploaden naar Google Drive, sheet-ID invullen in config.js.
4. **Smoke tests uitvoeren** — zie `docs/smoke-tests.md`.
5. **Export testen** — systeemprompt uit `docs/chatgpt-prompt.md` in de Custom GPT plakken en de weekexport-sectie testen met een echte week.

---

## Toestemmingsregel (CLAUDE.md)

- Nieuwe calendar events aanmaken mag altijd.
- Bestaande events **nooit** aanpassen of verwijderen zonder expliciete toestemming van Antje of Tonko.
- Originele weekplanningen in Google Drive: alleen lezen, nooit aanpassen.
