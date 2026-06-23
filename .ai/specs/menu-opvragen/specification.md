# Menu opvragen

## Intent
Haal het menu op voor een specifieke datum zodat de GPT kan antwoorden op
"wat eten we vandaag?" zonder de kalender handmatig te hoeven doorzoeken.

## Acceptance criteria
- `GET ?action=menu&datum=YYYY-MM-DD` geeft het menu voor die dag terug
- Response bevat `datum` en `menu` (de tekst van het menu-event)
- Als er geen menu-event is op die datum, geeft de API `{ menu: null }` terug
- De datum is verplicht; ontbreekt hij, dan volgt een foutmelding
- Out of scope: meerdere datums in één aanroep
- Out of scope: menu aanpassen via dit endpoint (dat is `POST action=menu`)
