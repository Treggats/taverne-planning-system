# Status

Momentopname van de huidige staat. Bijwerken zodra iets concreet verandert
(deploy, nieuw issue, issue opgelost, kalender/sheet erbij of weg).
Voor de chronologie zie `CHANGELOG.md`, voor designkeuzes `BESLISSINGEN.md`.

_Laatst bijgewerkt: 2026-06-22_

## Componenten

Huidige opstelling = **test-omgeving in Tonko's account** — volledig werkend en
end-to-end getest (kalender, bezorgservice, werkrooster, Custom GPT).
Volgende grote stap: productie-migratie naar Antje's account (zie onderaan).

### Google Calendar (Tonko's account, test)
- `Taverne`, `MSPA`, `Jules Huiskamer` — door Tonko aangemaakt voor end-to-end test.

### Google Apps Script (REST tussenlaag, Tonko's account)
- Code: `src/` (file-per-feature), gepusht met clasp — zie `docs/clasp-deploy.md`.
  `docs/apps-script-calendar.js` is alleen nog archief.
- **Live** op de bestaande `/exec`-URL (deployment `AKfycbwdRn…`, @4). clasp wijst
  naar het originele script (`scriptId 13TY851…` in `.clasp.json`, niet in git).
- OpenAPI schema: `docs/openapi.yaml` v3.0.0
- Endpoints kalender: `GET ?action=today`, `GET ?action=week&date=...`, `POST` (create)
- Endpoints bezorgservice: `GET ?action=bezorgingen&datum=...`, `POST action=afwijking`, `POST action=klant`
- Auth: token in querystring/body (zie `BESLISSINGEN.md`)

### Custom GPT
- Prompt: `docs/chatgpt-prompt.md`
- Spreekt Apps Script aan via OpenAPI schema (`docs/openapi.yaml`)
- **Aangemaakt en gekoppeld in Tonko's ChatGPT (test); end-to-end getest:
  lezen (today + werkrooster mét data) en schrijven (kalender event).**
- Setup-stappen: `docs/custom-gpt-setup.md`.
- Token gaat via het schema (`default: JOUW_TOKEN` → vervangen door het echte
  token); Authentication = None.

### Google Drive
- Weekplanningen map: `1HNs0w_MOtTSbgI4XekNuZTnoIHvX9sK1` (eigenaar Antje)

### Bezorgservice
- **In gebruik (door Antje geüpload)**: `1jfc7e2tmv5FDzZMOVXSGMmu14TQ5wIGhg87hRq7FmJ8`. Bereikbaar voor het script en geverifieerd (GET bezorgingen).
- Tabs: `Klanten` (rooster, porties, vast_toetje, bezorgwijze), `Afwijkingen`
- **Oude testsheet (te decommissioneren)**: `1r5i_SUqkW1FnV2jlVcAMumQZVMJMUWWTul0Cxo_WPjI` (Tonko); allereerste sheet `19qx7Or__9pwEp6KtMjLmm7Hq1Nc0hM0Rghd5VV0U9Pc` ook.

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
- **In gebruik (door Antje geüpload)**: `1Cymrle7EpkrLZrvPlUP2Ktm4aE7zBuMDcxjuJlGdmH4`
  in `src/config.js` (`SCHEDULE_SHEET_ID`). Bereikbaar voor het script en
  geverifieerd (GET werkrooster week 2026-14). Oude testsheet `1Blxy4y…` kan weg.
  Daarna nooit meer uploaden; al het beheer gebeurt in de live sheet via de GPT.
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
- Werkrooster: wekelijkse print/export voor in de keuken nog bouwen.

## Productie-migratie naar Antje's account

Doel: alles draait in Antje's account; Tonko houdt editor-toegang voor beheer.
De web app moet **als Antje** draaien (`executeAs`), zodat hij bij háár
kalenders en sheets kan — daarom maakt Antje (of: iemand ingelogd als Antje)
de deployment aan. Tonko beheert de code via clasp.

Volgorde:

1. **Drie kalenders** in Antje's account aanmaken (`Taverne`, `MSPA`,
   `Jules Huiskamer`); per kalender delen met Tonko (`Make changes to events`).
2. **Sheets** (bezorgservice + werkrooster) eigenaarschap overdragen: Tonko →
   Share → Antje → `Make owner`. Sheet-IDs blijven gelijk, dus
   `DELIVERY_SHEET_ID` / `SCHEDULE_SHEET_ID` in `src/config.js` hoeven niet te
   wijzigen.
3. **Apps Script project** in Antje's account:
   - Antje maakt een leeg Apps Script project en deelt het met Tonko (Editor).
   - Tonko zet `.clasp.json` `scriptId` naar dat project en doet `clasp push`
     (`src/` + `appsscript.json`, inclusief het `webapp`-blok).
4. **Deployen als web app — in Antje's context** (zodat `executeAs` = Antje):
   - Eerste keer het makkelijkst via de Apps Script-UI: `Deploy → New
     deployment → Web app → Execute as: Me (Antje), Who has access: Anyone`.
   - Antje keurt bij de eerste run de autorisatie voor Calendar + Sheets goed.
   - Latere code-updates: `clasp push` door Tonko, daarna deze deployment
     bijwerken (`clasp deploy -i <id>` of via de UI "New version").
5. **Nieuwe Web App `/exec`-URL** overnemen op drie plekken:
   - `src/config.js` (`URL`-constante),
   - `docs/openapi.yaml` (`servers.url`),
   - de Custom GPT-action (server-URL in het geplakte schema).
6. **Custom GPT** in Antje's ChatGPT account: nieuwe GPT met prompt +
   schema (zie `docs/custom-gpt-setup.md`), token vervangen, `Authentication:
   None`. Antje deelt de GPT-link met Tonko.
7. **Verifiëren** met `docs/smoke-tests.md`. Daarna het testproject + de
   testkalenders in Tonko's account opruimen (of als sandbox houden).

Aandachtspunten:
- **`webapp`-blok is verplicht** in `appsscript.json`, anders geeft de URL
  "Pagina niet gevonden" (zie `GOTCHAS.md`).
- **`clasp push` ≠ deploy** — na pushen altijd de deployment (her)deployen.
- **`executeAs` = wie de deployment aanmaakt** — doe de deploy dus in Antje's
  account, niet als Tonko.
- Het schema is al GPT-compatibel (één `PostAction`-object, geen `oneOf`).
- AUTH_TOKEN mag gelijk blijven; houd `src/config.js`, `openapi.yaml` en de
  GPT-action consistent.
- Token nooit in chat; alleen in `src/config.js` en de GPT-action-config.

## Bekende issues
_(geen)_
