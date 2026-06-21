# Status

Momentopname van de huidige staat. Bijwerken zodra iets concreet verandert
(deploy, nieuw issue, issue opgelost, kalender/sheet erbij of weg).
Voor de chronologie zie `CHANGELOG.md`, voor designkeuzes `BESLISSINGEN.md`.

_Laatst bijgewerkt: 2026-06-20_

## Componenten

Huidige opstelling = **test-omgeving in Tonko's account**.
Productie-migratie naar Antje's account: zie onderaan.

### Google Calendar (Tonko's account, test)
- `Taverne`, `MSPA`, `Jules Huiskamer` — door Tonko aangemaakt voor end-to-end test.

### Google Apps Script (REST tussenlaag, Tonko's account)
- Code: `docs/apps-script-calendar.js`
- OpenAPI schema: `docs/openapi.yaml` v3.0.0
- Endpoints kalender: `GET ?action=today`, `GET ?action=week&date=...`, `POST` (create)
- Endpoints bezorgservice: `GET ?action=bezorgingen&datum=...`, `POST action=afwijking`, `POST action=klant`
- Auth: token in querystring/body (zie `BESLISSINGEN.md`)

### Custom GPT
- Prompt: `docs/chatgpt-prompt.md`
- Spreekt Apps Script aan via OpenAPI schema
- Nog niet aangemaakt (wacht op Antje's ChatGPT toegang).

### Google Drive
- Weekplanningen map: `1HNs0w_MOtTSbgI4XekNuZTnoIHvX9sK1` (eigenaar Antje)

### Bezorgservice
- **v2 (rooster-gedreven, in gebruik)**: `1r5i_SUqkW1FnV2jlVcAMumQZVMJMUWWTul0Cxo_WPjI` (eigenaar Tonko)
- Tabs: `Klanten` (rooster, porties, vast_toetje, bezorgwijze), `Afwijkingen`
- **Oud (te decommissioneren)**: `19qx7Or__9pwEp6KtMjLmm7Hq1Nc0hM0Rghd5VV0U9Pc` (blijft staan tot v2 in productie)

### Werkrooster
- Eigen sheet, **snapshot per week** (los van de weekplanningen).
- Tabs: `Medewerkers` (naam, type, actief), `Diensten` (week, weekdag, naam, begin, eind, notitie)
- **Eén sheet, één keer uploaden.** Alle weken leven naast elkaar in `Diensten`,
  onderscheiden door de kolom `week` (`2026-14`, `2026-15`, …). Nieuwe weken komen
  erbij via de API (`week_kopieer` + `dienst`) — géén nieuw bestand per week.
- **Seed (eenmalig uploaden om de live sheet te maken)** — kies één:
  - `scripts/build_werkrooster.py` → lege variant (blanco beginnen).
  - `build/werkrooster-week-2026-14.xlsx` → gevuld met week 14 als startpunt
    (gegenereerd uit de laatst bekende weekplanning; niet in git, zie `build/.gitignore`).
- Na upload: `WERKROOSTER_SHEET_ID` in Apps Script invullen. Daarna nooit meer
  uploaden; al het beheer gebeurt in de live sheet via de GPT.
- Export/print voor in de keuken: nog te doen (aparte vervolgstap).

## Openstaande punten
- Tijdelijke klant-IDs 9001–9006 in bezorgservice-sheet moeten vervangen
  worden door echte nummers (input via Antje).
- Bezorgservice rooster onbekend voor 182 Marrie, 224 Grietje V., 242 Geertje,
  9004 Johanna — wacht op recentere weekplanningen van Antje.
- 325 Greet H. heeft tweewekelijks ritme (alleen even weken) — vooralsnog
  via `Afwijkingen` opgelost door elke oneven week een annulering te zetten.
  Bij meer klanten met dit ritme: frequentie-veld toevoegen.
- Eerste foutieve nieuwe sheet `Bezorgservice (nieuw)` (`1nPLI…`) moet weg.
- Werkrooster: sheet aanmaken + `WERKROOSTER_SHEET_ID` invullen, daarna end-to-end testen.
- Werkrooster: wekelijkse print/export voor in de keuken nog bouwen.

## Productie-migratie naar Antje's account

Te doen wanneer Antje klaar is om dit live te zetten:

1. **Drie kalenders** in Antje's account aanmaken (`Taverne`, `MSPA`, `Jules Huiskamer`); per kalender delen met Tonko (`Make changes to events`).
2. **Bezorgservice v2 sheet + Werkrooster sheet** eigenaarschap overdragen: Tonko → Share → Antje toevoegen → klik op haar rol → `Make owner`. Antje accepteert via mail. Sheet-IDs blijven hetzelfde.
3. **Apps Script project** kopiëren naar Antje's account: Tonko deelt project met Antje (Editor) → Antje doet `File → Make a copy` → deelt kopie weer met Tonko (Editor).
4. **Antje deployt** de kopie als web app (`Execute as: Me`, `Anyone`). Eerste run vraagt autorisatie voor Calendar + Sheets.
5. **Nieuwe Web App URL** vervangen in `docs/openapi.yaml` en de Custom GPT action.
6. **Custom GPT** aanmaken in Antje's ChatGPT account met de nieuwe URL, OpenAPI v3.0.0, prompt uit `chatgpt-prompt.md`. Antje deelt GPT-link met Tonko.
7. **Opruimen Tonko's account**: oude Apps Script project en testkalenders mogen weg, of laten staan als sandbox.

Aandachtspunten:
- AUTH_TOKEN gelijk houden (of beide kanten bijwerken) zodat de GPT-action niet breekt.
- BEZORGSERVICE_SHEET_ID blijft hetzelfde — overdracht verandert geen IDs.
- Token nooit in chat zetten in productie; alleen in Apps Script-constante en GPT-action config.

## Bekende issues
_(geen)_
