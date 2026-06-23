# Technical Plan

## Components
- Geen nieuwe backend-code nodig — `handleEmployee` doet al een upsert op naam
  en respecteert `actief=nee`
- `docs/chatgpt-prompt.md` — bestaande subsectie "Nieuwe medewerker" uitbreiden
  met instructie voor inactiveren + verplichte bevestigingsstap

## Expliciete afbakening
- Dit spec is puur een GPT-gedragswijziging, geen API-uitbreiding
- De `GET action=medewerkers` response bevat al het `actief`-veld; de GPT kan
  hierop filteren bij het suggereren van namen

## Afhankelijkheden
- Vereist dat `GET action=medewerkers` geïmplementeerd is (PR #22), zodat de
  GPT actieve en inactieve medewerkers uit elkaar kan houden
