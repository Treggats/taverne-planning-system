# Gotchas

Bekende valkuilen en eigenaardigheden van externe systemen waar we tegenaan
zijn gelopen. Niet uit de code af te leiden, niet documentatie, maar
ervaringskennis die toekomstige werk kan schelen. Toevoegen wanneer je een
half uur kwijt bent geweest aan iets dat in retrospect logisch was.

---

## ChatGPT Actions accepteren geen `oneOf` request body
_Vastgelegd: 2026-06-22_

Bij het plakken van het OpenAPI-schema in een Custom GPT:
`request body schema is not an object schema; skipping` +
`skipping function due to errors`.

ChatGPT Actions willen dat de POST-body **één object-schema** is. Een
`oneOf`/`anyOf` met `discriminator` (hoe correct ook qua OpenAPI) wordt
geweigerd, en daarmee valt de hele POST-operatie weg.

**Opgelost** door de 7 POST-varianten samen te voegen tot één `PostAction`-
object: `action` als enum + alle velden optioneel, met per veld in de
`description` welke action het betreft. De Apps Script routeert toch al op
`action` en valideert de verplichte velden per type, dus een permissief schema
is veilig. Conflict op `type` (afwijking vs medewerker) opgelost met een
gecombineerde enum.

## clasp deploy zonder `webapp`-blok sloopt een werkende web app
_Vastgelegd: 2026-06-22_

Een deployment die via de Apps Script-UI als web app was gemaakt (execute as
me / anyone) werkte prima. Na `clasp deploy -i <id>` gaf diezelfde URL ineens
HTML terug (`<title>Pagina niet gevonden</title>`) i.p.v. JSON — óók op
bestaande actions als `today`.

**Oorzaak:** bij een clasp-deploy neemt GAS de web-app-instellingen uit het
manifest. Stond er geen `webapp`-blok in `appsscript.json`, dan verliest de
nieuwe versie de toegang (geen entry point / niet publiek).

**Opgelost** door dit aan `appsscript.json` toe te voegen en opnieuw te
push'en + deployen:
```json
"webapp": {
  "executeAs": "USER_DEPLOYING",
  "access": "ANYONE_ANONYMOUS"
}
```
`ANYONE_ANONYMOUS` = bereikbaar zonder Google-login (nodig voor de GPT-action).
`USER_DEPLOYING` = draait als de eigenaar. Symptoom om op te letten: curl/GPT
krijgt Drive-HTML "Pagina niet gevonden" terug i.p.v. JSON.

## `filePushOrder` hoort in `.clasp.json`, niet in `appsscript.json`
_Vastgelegd: 2026-06-22_

`clasp push` faalde met:
`"appsscript.json" has errors: Invalid manifest: unknown fields: [filePushOrder]`.

`filePushOrder` is een **clasp**-configveld (`.clasp.json`), geen veld van het
GAS-manifest. Google valideert `appsscript.json` streng en weigert onbekende
velden. Het stond hier per ongeluk in het manifest.

**Opgelost door** `filePushOrder` te verwijderen: de laadvolgorde maakt voor
deze code niet uit (alle `src/`-bestanden zijn puur `const`/`function`-
declaraties; cross-file refs zitten in functie-bodies, dus pas op aanroep
geëvalueerd). Is ordening ooit wél nodig, dan in `.clasp.json` zetten.

## ISO-weeklabel: weekjaar ≠ kalenderjaar rond de jaargrens
_Vastgelegd: 2026-06-21_

Het werkrooster sleutelt op ISO-weeklabel `YYYY-WW` (`isoWeekLabel` in
`src/werkrooster.js`). ISO-8601 telt week 1 als de week met de eerste
donderdag van het jaar, en de `YYYY` is het **weekjaar**, niet per se het
kalenderjaar van de datum.

**Gevolg:** eind december/begin januari kan een datum in een ander jaar vallen
dan je verwacht. 2026-01-01 hoort bij week `2026-1`, maar 2025-12-29 t/m
2025-12-31 horen óók bij `2026-1` (maandag t/m woensdag van die ISO-week). Het
weeklabel is dus niet zomaar `datum.getFullYear()`.

**Waarom dit zo gekozen is:** de bestaande weekplanningen heten al
`Weekplanning 2026-14` (ISO, zonder zero-padding), dus we volgen exact die
conventie. Niet zelf weeknummers in de GPT laten rekenen — altijd een `datum`
meegeven en het label server-side bepalen.

## Apps Script POST via curl: redirect-handling
_Vastgelegd: 2026-06-20_

Een POST naar een Apps Script web app (`/macros/s/.../exec`) geeft altijd een
**302 redirect** naar `script.googleusercontent.com/macros/echo?user_content_key=...`.
De server slaat de body op met die key; de redirect URL haalt 'm op via GET.

**Probleem:** `curl -L` (zelfs met `--post301 --post302 --post303`) krijgt op
de gevolgde redirect HTML terug ("Pagina niet gevonden" Drive error), niet
de JSON die de Apps Script teruggeeft.

**Werkt wel:** redirect handmatig pakken en GET op de Location:

```bash
LOCATION=$(curl -s -o /dev/null -D - -X POST \
  -H 'Content-Type: application/json' \
  --data @body.json "$URL" | grep -i '^location:' | sed 's/^location: //I' | tr -d '\r\n')
curl -sL "$LOCATION"
```

**Voor de Custom GPT geen probleem** — ChatGPT's HTTP-client handelt
redirects netjes af. Dit is alleen relevant voor curl-tests of andere
eigen scripts tegen de Apps Script.
