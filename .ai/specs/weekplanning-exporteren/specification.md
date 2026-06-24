# Weekplanning exporteren

## Intent
Vanuit ChatGPT één commando geven om de weekplanning te exporteren naar Google Sheets:
de template wordt gekopieerd, hernoemd, gevuld met actuele data en ter controle aangeboden.
Antje geeft eventuele correcties door; de GPT verwerkt ze en schrijft ze terug.

## Template
Sheet ID: `1TANXejPS95x2z5rwKlOmelQmSj5-73rkzmqBMJAi7W0`
Drive map: `1HNs0w_MOtTSbgI4XekNuZTnoIHvX9sK1` (Weekplanningen)

## Bestandsnaamformaat
`weekplanning-<jaar>-<weeknummer>` — bijv. `weekplanning-2026-26`

## Tabbladen en vullogica

### gegevens
- A1: label "Weekdata" (niet overschrijven)
- A2:A8: de zeven datums van de week (ma t/m zo) in YYYY-MM-DD

### Planning
- A1: weeknummer (bijv. "Week 26")
- B2:H2: dagnamen (Maandag t/m Zondag)
- B3:H3: datums (dd/mm/jjjj)
- B4 en verder: kalenderitems per dag in de bijbehorende kolom,
  gesorteerd op begintijd (all-day events bovenaan)
- Bron: `GET action=week`

### Werkrooster
- Kolomindeling nader te bepalen op basis van het tabblad in de template
- Bron: `GET action=werkrooster`

### Bestelling
- Rij 1: weeknummer + datumbereik
- Rij 2: kolomkoppen
- Rij 3+: één rij per klant, kolommen: tijd | voornaam | achternaam | adres |
  klant_id | opmerkingen | per dag: aantal, toetje, bezorger (ma t/m za)
- Bron: `GET action=bezorgingen` × 6 (ma t/m za), gecombineerd

### Dag-tabs (Maandag t/m Zaterdag)
- Gebaseerd op `Dag template`-tabblad in de template sheet
- Kolommen: tijd | voornaam | achternaam | adres | telefoon | opmerkingen |
  toetje | bezorger
- Gesorteerd op tijd
- Bron: `GET action=bezorgingen` voor die dag

## Acceptance criteria
- `POST action=week_export` met `datum` maakt een nieuwe sheet aan
- Sheet staat in de Weekplanningen-map met de juiste naam
- Alle tabbladen zijn gevuld met actuele data
- Response bevat de URL van de nieuwe sheet
- Week bestaat al → foutmelding, geen duplicate
- Template niet gevonden → foutmelding

## Correctiestroom
- Antje controleert de sheet en geeft correcties door in de chat
- Correcties gaan via bestaande endpoints naar de bronsheets
- Daarna opnieuw exporteren (bestaande sheet overschrijven of verwijderen + opnieuw)

## Out of scope
- Automatisch synchroniseren bij wijzigingen in bronsheets
- Cellen in de exportsheet direct bewerken

## Gefaseerde aanpak
De **Werkrooster-tab** wordt in een tweede iteratie gebouwd zodra de kolomindeling
van het tabblad in de template bekend is. In de eerste versie blijft de tab leeg.
