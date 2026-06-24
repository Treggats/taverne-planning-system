# Bezorglijst opvragen

## Intent
Haal de volledige bezorglijst voor één dag op, zodat Antje weet wie er die dag
een maaltijd krijgt, wanneer en hoe, met alle afwijkingen al verwerkt.

## Acceptance criteria
- `GET ?action=bezorgingen&datum=YYYY-MM-DD` geeft de complete lijst voor die dag
- Klanten op rooster voor die weekdag worden standaard opgenomen
- Afwijkingen (annulering, wijziging, extra) worden toegepast op het standaardrooster:
  - annulering → klant wordt niet getoond
  - wijziging → klant wordt getoond met gewijzigde velden
  - extra → klant wordt extra getoond buiten zijn vaste rooster
- `datum` is verplicht; ontbreekt hij → foutmelding
- Resultaat is gesorteerd op bezorgtijd
- Out of scope: meerdere datums in één aanroep
