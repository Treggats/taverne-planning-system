# Development – nieuwe endpoints toevoegen

Dit document beschrijft hoe je een nieuw API-endpoint toevoegt aan het
Taverne Planning systeem. Elke toevoeging raakt vier plekken.

---

## Het patroon in 4 stappen

### 1. Handler schrijven

Voeg een functie toe in het relevante bestand in `src/`:

| Domein | Bestand |
|---|---|
| Kalender | `src/calendar.js` |
| Menu | `src/menu.js` |
| Bezorgservice | `src/bezorgservice.js` |
| Werkrooster / medewerkers | `src/werkrooster.js` |

Gebruik de bestaande helpers:
- `readRows(spreadsheet, tabNaam)` — leest een tab als array van objecten
- `response({ ... })` — stuurt een JSON-response terug
- `asTimeString(value)` — converteert een Google Sheets tijdwaarde naar `HH:MM`

### 2. Routing toevoegen in `src/main.js`

Voeg een `if`-blok toe in `doGet` (voor een GET-endpoint) of `doPost`
(voor een POST-endpoint), voor de afsluitende `return response(...)`:

```js
// GET
if (action === 'mijn_actie') {
  return handleMijnActie(e.parameter.param);
}

// POST
if (action === 'mijn_actie') {
  return handleMijnActie(body);
}
```

### 3. OpenAPI schema bijwerken (`docs/openapi.yaml`)

**GET-endpoint:** voeg de actienaam toe aan de `action` enum en voeg een
regeltje toe aan de `description`:

```yaml
enum: [today, week, ..., mijn_actie]
description: >
  ...
  mijn_actie = wat dit endpoint doet.
```

Voeg eventuele nieuwe parameters toe als aparte `- name:`-blokken.

**POST-endpoint:** voeg een nieuw schema toe onder `components/schemas` en
registreer het in de `discriminator/mapping`.

### 4. GPT-prompt bijwerken (`docs/chatgpt-prompt.md`)

Voeg een korte sectie toe in de relevante `##`-sectie. Vermeld:
- Wanneer de GPT dit endpoint moet gebruiken (in gewone taal)
- Welke parameters verplicht zijn
- Wat de response bevat

Hou het kort — de GPT leest dit als instructie, niet als documentatie.

---

## Voorbeeld: `GET action=medewerkers`

### 1. Handler (`src/werkrooster.js`)

```js
function handleListEmployees() {
  const employees = readRows(openScheduleSheet(), 'Medewerkers')
    .map(e => ({
      naam:   String(e.naam ?? '').trim(),
      type:   String(e.type ?? '').trim(),
      actief: String(e.actief ?? '').trim(),
    }))
    .filter(e => e.naam !== '');

  employees.sort((a, b) => a.naam.localeCompare(b.naam));
  return response({ medewerkers: employees });
}
```

### 2. Routing (`src/main.js`)

```js
if (action === 'medewerkers') {
  return handleListEmployees();
}
```

### 3. OpenAPI (`docs/openapi.yaml`)

```yaml
enum: [today, week, bezorgingen, werkrooster, medewerkers]
description: >
  ...
  medewerkers = lijst van alle medewerkers (naam, type, actief).
```

### 4. GPT-prompt (`docs/chatgpt-prompt.md`)

```
### Medewerkerslijst opvragen
`GET ?action=medewerkers` geeft alle medewerkers (naam, type, actief).
Gebruik dit bij "wie zijn de medewerkers?" of wanneer je een naam
moet opzoeken voor het invoeren van een dienst.
```

---

## Na de wijzigingen: deployen

Apps Script wordt niet automatisch gedeployed. Na elke wijziging:

1. Push de code via `clasp push` (of kopieer handmatig in de Apps Script editor)
2. Maak een nieuwe **versie** aan in Apps Script
3. Update de **deployment** om naar de nieuwe versie te wijzen

Zolang je de deployment-URL niet wijzigt, hoeft de Custom GPT niet opnieuw
geconfigureerd te worden.
