# Technical Plan

## Components
- `src/bezorgservice.js` — nieuwe `handleClientStatus(body)` functie: zoek rij op
  klant_id, update alleen de `actief`-kolom
- `src/main.js` — routing: `if (action === 'klant_status') return handleClientStatus(body)`
- `docs/openapi.yaml` — nieuw POST-schema `KlantStatus` met `klant_id` en `actief`
- `docs/chatgpt-prompt.md` — subsectie toevoegen aan `## Bezorgservice`; GPT vraagt
  altijd bevestiging vóór deactiveren ("Weet je zeker dat je [naam] wil deactiveren?")

## Expliciete afbakening
- Raakt niet aan `handleClient` (die blijft alleen voor nieuwe klanten)
- Geen upsert-gedrag: `klant_id` moet bestaan; anders foutmelding

## Afhankelijkheden
- Nieuwe hulpfunctie nodig: `findClientRow(sheet, headers, klantId)` — patroon
  identiek aan `findEmployeeRow` in `src/werkrooster.js`
