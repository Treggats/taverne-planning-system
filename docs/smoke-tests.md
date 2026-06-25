# Smoke tests – Taverne Planning GPT

Kopieer elke prompt hieronder letterlijk in de Custom GPT.  
Staat er **[CONTROLEER]** bij? Dan geeft het antwoord aan of de actie gelukt is.  
Staat er **[OPRUIMEN]** bij? Verwijder de testdata daarna handmatig in Google Sheets / Google Calendar.

Huidige referentiedatum voor de prompts: **week 2026-25** (ma 15 jun – zo 21 jun).  
Pas de datums aan als je de tests op een andere dag uitvoert.

---

## 1. Kalender – vandaag

**Prompt:**
```
Wat staat er vandaag in de kalender?
```

**[CONTROLEER]** Je krijgt een lijst van entries voor vandaag uit alle drie kalenders (Taverne, MSPA, Jules Huiskamer), of de melding dat er niets gepland staat. Geen foutmelding.

---

## 2. Kalender – week

**Prompt:**
```
Toon de volledige planning voor de week van 16 juni 2026.
```

**[CONTROLEER]** Je krijgt entries voor de week ma 15 jun – zo 21 jun 2026 (week 2026-25). Meerdere kalenders kunnen vertegenwoordigd zijn.

---

## 3. Bezorgservice – bezorglijst

**Prompt:**
```
Geef me de bezorglijst voor maandag 22 juni 2026.
```

**[CONTROLEER]** Je krijgt een lijst van klanten die maandag bezorgd worden, gesorteerd op bezorgtijd. Als er geen klanten zijn voor maandag staat de lijst leeg — dat is ook een geldig antwoord, zolang er geen foutmelding is.

---

## 4. Werkrooster – opvragen

**Prompt:**
```
Wie staat er ingeroosterd voor de week van 22 juni 2026?
```

**[CONTROLEER]** Je krijgt de diensten voor week 2026-26, gesorteerd op weekdag en begintijd. Lege week is ook geldig.

---

## 5. Kalender – nieuw event (schrijven)

**Prompt:**
```
Zet in de Jules Huiskamer kalender voor dinsdag 23 juni 2026 van 14:00 tot 15:00 een event neer met de naam "SMOKE TEST verwijder mij".
```

**[CONTROLEER]** Het GPT meldt dat het event aangemaakt is.  
**[OPRUIMEN]** Verwijder het event "SMOKE TEST verwijder mij" in Google Calendar (Jules Huiskamer).

---

## 6. Menu – toevoegen (schrijven)

**Prompt:**
```
Het menu voor woensdag 24 juni 2026 is: smoke test soep, brood.
```

**[CONTROLEER]** Het GPT meldt dat het menu toegevoegd is.  
**[OPRUIMEN]** Verwijder het all-day event "smoke test soep, brood" op 24 juni 2026 in de Taverne of Jules kalender.

---

## 7. Medewerker – toevoegen (schrijven)

**Prompt:**
```
Voeg een nieuwe medewerker toe: naam "SMOKE TEST", type vrijwilliger.
```

**[CONTROLEER]** Het GPT meldt `success: true` en of de medewerker toegevoegd is.  
**[OPRUIMEN]** Verwijder rij "SMOKE TEST" in tab **Medewerkers** van de Werkrooster sheet.

---

## 8. Dienst – toevoegen (schrijven)

*Voer eerst smoke test 7 uit zodat "SMOKE TEST" in de Medewerkers-tab staat.*

**Prompt:**
```
Rooster SMOKE TEST in voor maandag 22 juni 2026, van 09:00 tot 12:00.
```

**[CONTROLEER]** Het GPT meldt `success: true, added: true`.  
**[OPRUIMEN]** Verwijder de rij voor SMOKE TEST / 2026-26 / ma in tab **Diensten**.

---

## 9. Werkrooster – week kopiëren (schrijven)

*Zorg dat week 2026-26 minstens één dienst bevat (zie smoke test 8).*

**Prompt:**
```
Kopieer het werkrooster van week 25 van 2026 naar week 99 van 2026.
```

**[CONTROLEER]** Het GPT meldt hoeveel diensten gekopieerd zijn (of de foutmelding "Geen diensten gevonden" als week 25 leeg is — ook goed).  
**[OPRUIMEN]** Als er data is weggeschreven: verwijder alle rijen met week `2026-99` in tab **Diensten**.

---

## 10. Dienst – verwijderen (schrijven)

*Vereist dat smoke test 8 is uitgevoerd en de dienst nog bestaat.*

**Prompt:**
```
Verwijder de dienst van SMOKE TEST op maandag 22 juni 2026.
```

**[CONTROLEER]** Het GPT meldt `success: true, deleted: true`.  
Controleer in de sheet dat de rij verdwenen is.

---

## 11. Bezorgservice – afwijking (schrijven)

*Vereist een bestaande klant. Gebruik een klant_id die in de sheet staat.*

**Prompt:**
```
Klant 101 kan maandag 22 juni 2026 niet ontvangen — registreer een annulering.
```

*(Vervang 101 door een werkelijk klant_id uit de Klanten-tab.)*

**[CONTROLEER]** Het GPT meldt `success: true`.  
**[OPRUIMEN]** Verwijder de regel in tab **Afwijkingen** van de Bezorgservice sheet.

---

## 12. Bezorgservice – nieuwe klant (schrijven)

**Prompt:**
```
Voeg een nieuwe bezorgklant toe: voornaam "SMOKE", achternaam "TEST",
adres "Teststraat 1, Assen", rooster "ma,wo", vaste bezorgtijd 12:00,
bezorgwijze bezorgen.
```

**[CONTROLEER]** Het GPT meldt `success: true` en geeft een `klant_id` terug.  
**[OPRUIMEN]** Verwijder de rij "SMOKE TEST" in tab **Klanten** van de Bezorgservice sheet.

---

## 13. Menu – opvragen

**Prompt:**
```
Wat is het menu voor woensdag 24 juni 2026?
```

**[CONTROLEER]** Het GPT geeft het menu voor die datum, of meldt netjes dat er geen menu is. Geen foutmelding.

---

## 14. Bezorgservice – klantenlijst

**Prompt:**
```
Geef me de lijst met alle bezorgklanten.
```

**[CONTROLEER]** Het GPT toont actieve én inactieve klanten met rooster, vaste bezorgtijd en bezorgwijze. Geen foutmelding.

---

## 15. Werkrooster – medewerkerslijst

**Prompt:**
```
Wie staan er in de medewerkerslijst?
```

**[CONTROLEER]** Het GPT toont alle medewerkers met type (vast/stagiair/vrijwilliger) en actief-status. Geen foutmelding.

---

## 16. Kalender – terugkerende afspraak (schrijven)

**Prompt:**
```
Zet in de Jules Huiskamer kalender elke dinsdag van 14:00 tot 15:00
een event "SMOKE TEST wekelijks", startend op 23 juni 2026,
tot en met 14 juli 2026.
```

**[CONTROLEER]** Het GPT meldt dat de reeks aangemaakt is. Controleer in Google Calendar dat het event op 23/6, 30/6, 7/7 en 14/7 staat.  
**[OPRUIMEN]** Verwijder de hele reeks "SMOKE TEST wekelijks" in Google Calendar (Jules Huiskamer).

---

## 17. Bezorgservice – afwijking verwijderen (schrijven)

*Vereist dat smoke test 11 net is uitgevoerd en de afwijking nog bestaat.*

**Prompt:**
```
Verwijder de afwijking voor klant 101 op maandag 22 juni 2026.
```

*(Gebruik hetzelfde klant_id en dezelfde datum als in test 11.)*

**[CONTROLEER]** Het GPT vraagt bevestiging; na "ja" meldt het `success: true, deleted: true`. Controleer in tab **Afwijkingen** dat de rij weg is.

---

## 18. Bezorgservice – klant deactiveren (schrijven)

*Vereist dat smoke test 12 is uitgevoerd; gebruik het `klant_id` van SMOKE TEST.*

**Prompt:**
```
Deactiveer klant SMOKE TEST.
```

**[CONTROLEER]** Het GPT vraagt bevestiging; na "ja" meldt het `success: true`. In tab **Klanten** staat `actief: nee` voor SMOKE TEST.  
**[OPRUIMEN]** Verwijder de rij SMOKE TEST volledig (zie ook test 12-opruimen).

---

## 19. Werkrooster – medewerker deactiveren (schrijven)

*Vereist dat smoke test 7 is uitgevoerd en SMOKE TEST nog actief in de Medewerkers-tab staat.*

**Prompt:**
```
Deactiveer medewerker SMOKE TEST.
```

**[CONTROLEER]** Het GPT vraagt bevestiging; na "ja" meldt het `success: true`. In tab **Medewerkers** staat `actief: nee` voor SMOKE TEST.  
**[OPRUIMEN]** Verwijder de rij SMOKE TEST volledig (zie ook test 7-opruimen).

---

## 20. Werkrooster – week wissen (schrijven)

*Voer eerst test 9 uit zodat week 2026-99 minstens één dienst bevat.*

**Prompt:**
```
Maak het werkrooster van week 99 van 2026 helemaal leeg.
```

**[CONTROLEER]** Het GPT vraagt bevestiging; na "ja" meldt het hoeveel diensten gewist zijn. Tab **Diensten** bevat geen rijen meer met week `2026-99`.

---

## 21. Weekplanning – exporteren naar Google Sheets (schrijven)

**Prompt:**
```
Exporteer de weekplanning voor de week van 22 juni 2026.
```

**[CONTROLEER]** Het GPT meldt `success: true` en geeft een Google Sheets URL terug. Open de URL en controleer dat alle tabbladen (kalender, werkrooster, bestelling/dagen) gevuld zijn.  
**[OPRUIMEN]** Verwijder de aangemaakte sheet voor week 2026-26 in de map Weekplanningen op Google Drive.

---

## Volgorde voor een volledige run

1. Test 1–4 (alleen lezen, geen opruimen nodig)
2. Test 13–15 (alleen lezen, geen opruimen nodig)
3. Test 5 → opruimen calendar
4. Test 6 → opruimen calendar
5. Test 16 → opruimen calendar (hele reeks)
6. Test 7 (medewerker aanmaken)
7. Test 8 (dienst aanmaken via medewerker uit stap 6)
8. Test 9 (week kopiëren) → produceert data voor test 20
9. Test 10 (dienst verwijderen) → controleert stap 7
10. Test 20 (week wissen) → ruimt data van test 9 op
11. Test 11 (afwijking)
12. Test 17 (afwijking verwijderen) → controleert/ruimt test 11
13. Test 12 (klant aanmaken)
14. Test 18 (klant deactiveren) → gebruikt klant uit test 12, daarna opruimen sheet
15. Test 19 (medewerker deactiveren) → gebruikt medewerker uit test 6, daarna opruimen sheet
16. Test 21 (weekplanning exporteren) → opruimen Drive
