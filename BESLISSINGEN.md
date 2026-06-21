# Beslissingen

Niet-triviale designkeuzes met motivatie. Alleen toevoegen als de "waarom"
niet uit de code of `CLAUDE.md` zelf af te leiden is. Nieuwste bovenaan.
Format per beslissing: korte titel, datum, **Waarom**, eventueel **Alternatief overwogen**.

---

## Werkrooster: snapshot per week, niet rooster + afwijkingen
_Vastgelegd: 2026-06-21_

Het werkrooster krijgt een eigen sheet (`Werkrooster`) met een tab
`Medewerkers` (namenlijst) en `Diensten` (één rij per persoon per werkdag per
week, gesleuteld op ISO-weeklabel `YYYY-WW`). Elke week wordt vers opgebouwd;
`week_kopieer` kopieert een vorige week als startpunt.

**Waarom:** Analyse van de weekplanningen liet zien dat werktijden wekelijks
schuiven — zelfs Antje zelf (wk 1–2 start 08:00/08:30, wk 3–5 09:00, wk 6–9
weer 08:00). Een vast basisrooster zou dus elke week grotendeels worden
overschreven; dan voegt het "vaste" deel niets toe en wordt het juist
verwarrend. Een snapshot per week sluit aan bij hoe Antje het nu elk weekend
opnieuw opbouwt.

**Alternatief overwogen:** Vast rooster + afwijkingen zoals de bezorgservice.
Verworpen omdat staffing veel volatieler is dan de (stabiele) klantenroosters;
de afwijkingen zouden de regel worden i.p.v. de uitzondering.

**Bewust uitgesteld:** De wekelijkse print/export voor in de keuken. Eerst
beheer bouwen en valideren; export als aparte vervolgstap.

## Werkrooster mag wél bewerkt/verwijderd worden via de GPT
_Vastgelegd: 2026-06-21_

De regel "bestaande items nooit aanpassen/verwijderen" geldt voor calendar
events en de originele weekplanningen. De `Werkrooster`-sheet is onze eigen
beheerde opslag; `dienst` doet upsert en delete, `week_kopieer` schrijft rijen.

**Waarom:** "Volledig beheren" is hier expliciet de wens van Antje. Er is geen
externe bron van waarheid die beschermd moet worden — de sheet ís de bron.

## Bezorgservice: rooster-gedreven met afwijkingen-tab
_Vastgelegd: 2026-06-19_

`Klanten` krijgt de eigenschappen `rooster` (comma-separated weekdagen),
`porties`, `vast_toetje`, `bezorgwijze` (bezorgen/ophalen/ter_plaatse).
Een nieuwe tab `Afwijkingen` houdt alleen de uitzonderingen bij
(annulering / extra / wijziging). De bezorglijst voor een dag wordt
afgeleid door Apps Script: filter klanten waar weekdag in `rooster` zit
én `actief = ja`, pas afwijkingen toe.

**Waarom:** De oude `Bezorgingen` tab kreeg ~40 rijen/week aan voorspelbaar
herhaalwerk dat 1:1 uit klanteigenschappen volgde. Bron van waarheid
verspreid over twee plekken (klantstatus + bezorgrij) leverde
inconsistenties op (9001 als `actief: nee` maar wel bezorgd).
Rooster-gedreven betekent één bron, ~95% minder data invoer, geen
verlopen status-mismatches mogelijk.

**Alternatief overwogen:** Apps Script genereert dagelijks de bezorgrijen
in een sheet (hybride). Verworpen: behoudt de dubbele bron van waarheid
en is foutgevoeliger bij rooster-wijzigingen.

## Bezorglijst-logica in Apps Script, niet in GPT
_Vastgelegd: 2026-06-19_

De filter + merge van `Klanten` met `Afwijkingen` voor een bepaalde datum
draait in Apps Script (nieuwe action `bezorgingen`), niet in de GPT.

**Waarom:** LLM's zijn niet betrouwbaar in deterministische data-joins.
Eén plek voor de logica maakt aanpassingen (bv. extra veld op de
bezorglijst) trivial; de GPT doet één API-call en presenteert het
resultaat.

---

## Bestaande events worden nooit aangepast of verwijderd
_Vastgelegd: 2026-06-19 (uit CLAUDE.md overgenomen)_

Nieuwe events aanmaken mag altijd. Bestaande events alleen wijzigen of
verwijderen met expliciete toestemming van Antje of Tonko.

**Waarom:** Antje is eindgebruiker en moet kunnen vertrouwen dat haar
agenda niet onverwacht verandert. Originele weekplanningen in Google Drive
zijn de bron van waarheid en blijven alleen-lezen.

---

## `lunch: ja` wordt automatisch herschreven naar `lunch: A+B+fruit`
_Vastgelegd: 2026-06-19 (uit `docs/apps-script-calendar.js` regel 79)_

In `handleCreate` wordt `body.lunch === 'ja'` vervangen door `'A+B+fruit'`
voordat het in de event-beschrijving terechtkomt.

**Waarom:** Standaardlunch is A+B+fruit (A=warm, B=gehaktballen). Antje
hoeft alleen afwijkingen te vermelden. Door `ja` als shortcut te accepteren
en server-side te expanderen blijven calendar-entries consistent en
machineleesbaar zonder dat de gebruiker de samenstelling hoeft te onthouden.

---

## Auth via token in querystring/body, niet header
_Vastgelegd: 2026-06-19 (uit `docs/apps-script-calendar.js`)_

`doGet` leest token uit `e.parameter.token`, `doPost` uit `body.token`.

**Waarom:** Google Apps Script webapp endpoints krijgen geen custom
HTTP-headers door — alleen URL parameters en body zijn betrouwbaar
beschikbaar. Daarom token in plaats van een Authorization-header.
