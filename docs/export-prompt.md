# Weekexport – GPT-prompt

Kopieer de prompt hieronder in de Custom GPT.  
Vul `[MAANDAG]` in als concrete datum in `YYYY-MM-DD` formaat
(bijv. `2026-06-22` voor week 26).

De GPT haalt alle data op via de bestaande API-endpoints en presenteert de
uitvoer per tabblad, klaar om in de `[template] Weekplanning` te plakken.

---

## De exportprompt

```
Maak een weekexport voor de week die begint op maandag [MAANDAG].

Voer de onderstaande stappen in volgorde uit en label elke sectie duidelijk.

---

STAP 1 — KALENDERPLANNING
Roep action=week aan met date=[MAANDAG].
Presenteer de entries gesorteerd per dag, per dag op begintijd.
Label deze sectie "=== PLANNING-TAB ===".

Per dag een kopje met de datum, daarna per entry:
  Tijd: [begin]–[eind]  |  Kalender: [kalender]  |  [naam]
  Locatie: [locatie]  |  Aantal: [aantal]  |  Lunch: [lunch]
  Notities: [notities]

Sla lege velden over.

---

STAP 2 — WERKROOSTER
Roep action=werkrooster aan met datum=[MAANDAG].
Groepeer de diensten per medewerker; één rij per medewerker.
Lege cel = de medewerker werkt die dag niet.
Label deze sectie "=== WERKROOSTER-TAB ===".

Tabel met kolommen:
  Naam | MA begin | MA eind | DI begin | DI eind | WO begin | WO eind
       | DO begin | DO eind | VR begin | VR eind | ZA begin | ZA eind
       | ZO begin | ZO eind

Voeg onderaan de regel toe:
  Datums: MA=[MAANDAG], DI=[MA+1], WO=[MA+2], DO=[MA+3], VR=[MA+4],
          ZA=[MA+5], ZO=[MA+6]

---

STAP 3 — BEZORGLIJSTEN PER DAG
Roep action=bezorgingen aan voor elk van de volgende datums:
  [MAANDAG], [MA+1], [MA+2], [MA+3], [MA+4], [MA+5], [MA+6]

Label elke dag apart als "=== [WEEKDAG DD MMM]-TAB ===" (bijv. "=== MAANDAG 22 JUN-TAB ===").
Sla een dag over als de bezorglijst leeg is.

Tabel per dag gesorteerd op bezorgtijd:
  Klant# | Tijd | Naam | Adres | Telefoon | Opmerkingen/Dieetwensen | Porties | Toetje | Bezorger | Notitie

Voeg onderaan toe: Totaal: [aantal klanten]  |  Reserve: 4

---

STAP 4 — WEEKOVERZICHT BEZORGING
Combineer alle bezorgdata tot één matrix.
Elke unieke klant (op klant_id; onbekend klant_id gebaseerd op naam) krijgt één rij.
Label deze sectie "=== BESTELLING-TAB ===".

Gebruik de vaste kolomvolgorde van de template:
  Klant# | Tijd | Naam | Adres | Telefoon | Opmerkingen |
  MA [datum] | Toetje | Bezorger |
  DI [datum] | Toetje | Bezorger |
  WO [datum] | Toetje | Bezorger |
  DO [datum] | Toetje | Bezorger |
  VR [datum] | Toetje | Bezorger |
  ZA [datum] | Toetje | Bezorger |
  ZO [datum] | Toetje | Bezorger

Vulregels:
  - Dag-cel: het aantal porties (normaal 1) als er die dag bezorgd wordt, anders leeg
  - Toetje-cel: 1 als toetje=ja, anders leeg
  - Bezorger-cel: naam van de bezorger als ingevuld, anders leeg

Sorteer op vaste bezorgtijd (Tijd-kolom), dan op naam.
```

---

## Overdracht naar de template

Open `[template] Weekplanning` in Google Sheets en werk de tabs bij:

| GPT-sectie | Template-tab | Actie |
|---|---|---|
| PLANNING-TAB | `Planning` | Zet per dag de events in de juiste kolom; verwijder vorige inhoud eerst |
| WERKROOSTER-TAB | `Werkrooster` | Kopieer de tabel over de bestaande medewerkerrijen; type-prefix (M/Bez/VW) handmatig toevoegen |
| [WEEKDAG]-TAB | `Maandag` t/m `Zondag` | Vervang de bestaande rijen; bewaar de Reserve-rij onderaan |
| BESTELLING-TAB | `Bestelling` | Vervang de bestaande rijen; bewaar de Reserve-rij en de totaalrij |

### Handmatig invullen na import

**`gegevens`-tab** (doet de GPT niet):
- Cel met datums: vul de 7 datums in (ma t/m zo)
- Uitzonderingen (cel B11): noteer rijnummers van klanten met een afwijkende
  bezorgtijd, gescheiden door puntcomma's (bijv. `13;15;`)

**Naam in twee kolommen** — de API geeft één gecombineerde naam terug.
In de template staan `Voornaam` en `Achternaam` als aparte kolommen.
Splits de naam handmatig als het er voor de print op aankomt.

**Werkrooster type-prefix** — de API geeft geen medewerkerstype terug.
Voeg de prefix (M / Bez / VW / proef) handmatig toe in de eerste kolom
van de Werkrooster-tab.
