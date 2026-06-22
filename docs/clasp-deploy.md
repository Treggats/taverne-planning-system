# Deployen met clasp

De Apps Script-code leeft in `src/` en wordt met [clasp](https://github.com/google/clasp)
(Google's CLI) naar het script-project gepusht. Geen kopieer-plak-werk meer in
de browser-editor.

> **Kernregel:** `push` en `deploy` zijn twee stappen.
> `clasp push` werkt de code bij; de live `/exec`-URL verandert pas na een
> `clasp deploy`. Vergeet je de tweede stap, dan draait de web app nog de oude
> code (symptoom: `{"error":"Unknown action"}` op een nieuwe action).

## Eenmalige setup

1. **Apps Script API aanzetten** voor je account:
   <https://script.google.com/home/usersettings> → "Google Apps Script API" → On.
2. **Inloggen** (opent de browser voor OAuth):
   ```bash
   clasp login
   ```
   Dit schrijft credentials naar `~/.clasprc.json` (geheim, staat in `.gitignore`).
3. **`.clasp.json` aanmaken** in de projectroot, met het Script-ID van het
   bestaande project (Apps Script-editor → ⚙ Project Settings → "Script ID"):
   ```json
   {
     "scriptId": "<JOUW_SCRIPT_ID>",
     "rootDir": "."
   }
   ```
   `rootDir` is `.` omdat `appsscript.json` in de root staat en `filePushOrder`
   naar `src/...` verwijst. `.clasp.json` staat in `.gitignore` — het verschilt
   per omgeving (test vs. productie).

## Code bijwerken (dagelijks)

```bash
clasp push          # upload src/ + appsscript.json naar het script
```

Alleen `appsscript.json` en `src/**` worden gepusht; `.claspignore` houdt het
archief (`docs/apps-script-calendar.js`), `build/`, `scripts/` en docs buiten de
push. De laadvolgorde maakt niet uit: elk `src/`-bestand bevat alleen `const`-
en `function`-declaraties, en alle cross-file verwijzingen staan in functie-
bodies (uitgevoerd op aanroep, niet bij laden). Mocht ooit top-level code een
constante uit een ander bestand nodig hebben, zet dan `filePushOrder` in
`.clasp.json` (níet in `appsscript.json` — dat veld kent het manifest niet).

## Live zetten (web app URL bijwerken)

De `/exec`-URL wijst naar één deployment. Werk díe deployment bij zodat de URL
gelijk blijft (en de OpenAPI/GPT-config niet hoeft te wijzigen):

```bash
clasp deployments                                   # vind het deployment-ID
clasp deploy -i <deploymentId> -d "korte omschrijving"
```

Een `clasp deploy` zónder `-i` maakt een **nieuwe** deployment met een **nieuwe
URL** — dat breekt de bestaande GPT-action. Gebruik dus altijd `-i`.

## Verifiëren

```bash
URL='<deployed /exec URL>'
TOKEN='<AUTH_TOKEN uit src/config.js>'
curl -sL "$URL?token=$TOKEN&action=today"
curl -sL "$URL?token=$TOKEN&action=werkrooster&datum=2026-03-30"
```

POST-tests: zie `docs/smoke-tests.md` (let op de redirect-afhandeling uit
`GOTCHAS.md` bij curl).

## Productie (Antje's account)

Productie is een ander script in Antje's account, dus een ander `scriptId`.
Opties: `.clasp.json` omzetten naar haar Script-ID (en `clasp login` als haar
account), of dev bij Tonko houden en de code los naar het productie-script
deployen. Zie de migratie-checklist in `STATUS.md`.
