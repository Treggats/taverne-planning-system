# Technical Plan

## Components
- `src/bezorgservice.js` — nieuwe `handleDeleteException(body)` functie: zoek rij
  op `klant_id` + `datum`, verwijder hem; geef `{ success: true, deleted: true/false }`
- `src/main.js` — routing voor `action === 'afwijking_verwijderen'` in `doPost`
- `docs/openapi.yaml` — nieuw POST-schema `AfwijkingVerwijderen` met `klant_id`
  en `datum`; action-waarde `afwijking_verwijderen`
- `docs/chatgpt-prompt.md` — subsectie toevoegen onder `### Afwijking toevoegen`;
  GPT vraagt bevestiging vóór verwijderen

## Expliciete afbakening
- Gebruikt een eigen action-naam (`afwijking_verwijderen`) om verwarring met
  `POST action=afwijking` (toevoegen) te voorkomen
- Raakt niet aan `handleException`; beide handlers blijven onafhankelijk
- Zoekt op klant_id + datum als samengestelde sleutel — identiek patroon als
  `findShiftRow` in `src/werkrooster.js`

## Afhankelijkheden
- `readHeaders` en `openDeliverySheet` uit `src/bezorgservice.js` — al aanwezig
- Geen nieuwe hulpfuncties nodig; zoeklogica inline in `handleDeleteException`
