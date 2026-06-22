# Stappenplan: Custom GPT instellen

Zo koppel je de Custom GPT aan de Apps Script API. Volg de stappen op de
**Configure**-tab (niet de chat-"Create"-builder).

## Voorbereiding

Je hebt twee dingen nodig uit deze repo:
- **Systeemprompt**: de inhoud van `docs/chatgpt-prompt.md`
- **OpenAPI-schema**: de inhoud van `docs/openapi.yaml`
- **Token**: `AUTH_TOKEN` uit `src/config.js` (regel 1). Kopieer die waarde; je
  plakt 'm straks in het schema, niet in een chat.

## 1. Basisinstellingen (Configure-tab)

1. Klik bovenin op **Configure** (naast "Create").
2. **Name**: `Taverne Planning`
3. **Description**: `Planning, bezorglijst en werkrooster voor Antje's Taverne.`
4. **Instructions**: plak de volledige inhoud van `docs/chatgpt-prompt.md`.
5. **Conversation starters** (optioneel): bijv.
   - `Wat staat er vandaag op de planning?`
   - `Bezorglijst van morgen`
   - `Wie werkt er volgende week woensdag?`
6. **Capabilities**: zet **Web Search**, **Canvas**, **Image Generation** en
   **Code Interpreter** uit — niet nodig, voorkomt verwarring.

## 2. Action toevoegen

1. Onderaan bij **Actions**: klik **Create new action**.
2. **Authentication**: laat op **None**. (Het token gaat via het schema mee,
   niet via een header — Apps Script ontvangt geen custom headers.)
3. **Schema**: plak de volledige inhoud van `docs/openapi.yaml`.
4. **Vervang in het geplakte schema alle `JOUW_TOKEN` door het echte token**
   (uit `src/config.js`). Het staat er 2× in (1× GET, 1× POST). De server-URL
   staat al goed ingevuld.
5. Onder het schema verschijnen nu twee **Available actions**:
   `getPlanning` (GET) en `postAction` (POST).
6. **Privacy policy**: alleen verplicht als je de GPT later publiek deelt. Voor
   eigen gebruik / "Only me" mag dit leeg blijven.

## 3. Testen (rechter previewvenster)

1. Vraag: **"Wat staat er vandaag op de planning?"**
   - ChatGPT vraagt eenmalig toestemming om `script.google.com` aan te roepen →
     kies **Allow** (of **Always Allow**).
   - Verwacht: een (eventueel lege) lijst met kalenderitems van vandaag.
2. Vraag: **"Wie werkt er in de week van 30 maart 2026?"**
   - Verwacht: het werkrooster van week 2026-14.
3. Schrijftest: **"Zet een testmenu voor 30 maart: soep"** → controleer in de
   Taverne-kalender, en verwijder het daarna handmatig (de GPT mag bestaande
   events niet verwijderen).

Krijg je `Unauthorized`? Dan staat er nog ergens `JOUW_TOKEN` in het schema, of
is het token verkeerd overgenomen.

## 4. Opslaan en delen

- Klik **Create / Update** rechtsboven.
- **Zichtbaarheid** voor testen: **Only me**.
- Voor Antje: de GPT hoort uiteindelijk in **haar** ChatGPT-account (zie de
  productie-migratie in `STATUS.md`). Tot die tijd kun je 'm in jouw account
  testen.

## Waarom deze keuzes

- **Authentication None + token in het schema**: Apps Script web apps krijgen
  geen custom HTTP-headers door, dus ChatGPT's API-Key-auth (header/bearer) zou
  niet werken. Het token gaat daarom als parameter (GET) en body-veld (POST)
  mee; de `default`-waarde in het schema zorgt dat ChatGPT het automatisch
  meestuurt. Zie `BESLISSINGEN.md`.
- **Token niet in deze repo's `openapi.yaml`**: het schema houdt `JOUW_TOKEN`
  als placeholder; het echte token leeft alleen in `src/config.js` en in de
  GPT-action-config die jij invult.
