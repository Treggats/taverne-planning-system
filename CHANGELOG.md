# Changelog

Chronologisch logboek van concrete wijzigingen. Nieuwste bovenaan.
Eén regel per wijziging, formaat: `- YYYY-MM-DD — wat er veranderd is (welk bestand/component)`.
Aan het eind van een werksessie waarin iets is gewijzigd toevoegen.
Voor de huidige staat zie `STATUS.md`, voor "waarom" `BESLISSINGEN.md`.

## 2026-06-21
- `docs/apps-script-calendar.js`: `handleMenu` toegevoegd (all-day event in Taverne, `menu:` in beschrijving). `getAllEvents` past nu `isAllDayEvent()` toe: all-day events krijgen `geheel_dag: true` zonder `begin`/`eind`; sort gecorrigeerd voor `undefined` begin.
- `docs/openapi.yaml`: `MenuEntry` schema toegevoegd; `menu` opgenomen in `oneOf` en discriminator mapping.

## 2026-06-20
- `STATUS.md`: sectie `Productie-migratie naar Antje's account` toegevoegd (eigenaarschap sheet, Apps Script kopie, deploy, sharing zodat Tonko toegang behoudt).
- Apps Script end-to-end gevalideerd in Tonko's account: kalender entries (3 kalenders, 3 lunch-varianten) en bezorgservice (GET + POST afwijking) werken.
- `GOTCHAS.md` toegevoegd: vierde tracking-bestand voor eigenaardigheden van externe systemen. Eerste entry: Apps Script POST + curl redirect-handling.
- Apps Script v3 (kalender + bezorgservice) als web app live; smoke test op `?action=bezorgingen` en POST geslaagd.

## 2026-06-19
- `docs/apps-script-calendar.js`: bezorgservice endpoints toegevoegd. `GET ?action=bezorgingen&datum=…` levert de afgeleide bezorglijst. `POST action=afwijking` en `POST action=klant` schrijven in `Bezorgservice v2`. Backward compat: POST zonder action blijft kalender create.
- `docs/openapi.yaml` v3.0.0: bezorgingen-actie + `oneOf` discriminator op `action` voor POST (KalenderEntry / Afwijking / Klant).
- `docs/chatgpt-prompt.md`: bezorgservice instructies toegevoegd (bezorglijst opvragen, afwijking en klant toevoegen).
- `scripts/build_bezorgservice.py` toegevoegd: genereert de v2-sheet (Klanten + Afwijkingen) als xlsx. Vereist `openpyxl`.
- Definitieve nieuwe sheet `Bezorgservice v2` aangemaakt (`1r5i_SUqkW1FnV2jlVcAMumQZVMJMUWWTul0Cxo_WPjI`) in Weekplanningen-map. Klanten verrijkt met rooster/porties/vast_toetje/bezorgwijze; nieuwe Afwijkingen-tab met kolommen `datum`, `weekdag`, `klant_id`, `type`, `porties`, `toetje`, `tijd`, `bezorgwijze`, `bezorger`, `notitie`. Startrijen: 234 wo 18:00, 9005 do 18:30, 9004 zo bezorger Iris.
- Tussenversies van bezorgservice-sheet (`1nPLI_BHVX8gPcaCgXE3Tu01j86apy8iORGz4KK-SXyE` was de eerste; foutief schema) — kan weg.
- Eerste Claude Code sessie geopend; tracking-systeem opgezet (`STATUS.md`, `CHANGELOG.md`, `BESLISSINGEN.md`).

## Daarvoor (via claude.ai, niet per datum vastgelegd)
- Apps Script REST tussenlaag opgezet met 3 kalenders (Taverne, MSPA, Jules Huiskamer).
- OpenAPI schema voor Custom GPT opgesteld.
- ChatGPT prompt opgesteld.
- Bezorgservice-sheet aangemaakt met tabs Klanten en Bezorgingen.
