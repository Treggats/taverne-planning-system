# Gotchas

Bekende valkuilen en eigenaardigheden van externe systemen waar we tegenaan
zijn gelopen. Niet uit de code af te leiden, niet documentatie, maar
ervaringskennis die toekomstige werk kan schelen. Toevoegen wanneer je een
half uur kwijt bent geweest aan iets dat in retrospect logisch was.

---

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
