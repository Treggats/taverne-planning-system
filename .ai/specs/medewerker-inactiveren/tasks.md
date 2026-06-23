# Tasks

- [x] 1. Breid de subsectie "Nieuwe medewerker" in `docs/chatgpt-prompt.md` uit:
         - Leg uit dat `actief=nee` een medewerker inactiveert
         - Voeg instructie toe: vraag altijd bevestiging vóór inactiveren
         - Voeg instructie toe: suggereer alleen actieve medewerkers bij plannen
- [ ] 2. Smoke test: stuur `POST action=medewerker` met `naam=X, actief=nee` →
         `{ success: true, updated: true }`
- [ ] 3. Smoke test: `GET action=medewerkers` toont medewerker X met `actief: nee`
- [ ] 4. Smoke test: vraag GPT "rooster Iris in op maandag" → GPT suggereert Iris
         niet als ze inactief is (alleen via geüpdatete systeemprompt te testen)
