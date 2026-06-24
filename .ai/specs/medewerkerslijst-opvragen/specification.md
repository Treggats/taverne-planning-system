# Medewerkerslijst opvragen

## Intent
Haal de volledige lijst van medewerkers op zodat de GPT namen kan voorstellen
bij het inplannen van diensten en inactieve medewerkers kan uitsluiten.

## Acceptance criteria
- `GET ?action=medewerkers` geeft alle medewerkers terug, inclusief inactieve
- Response bevat `medewerkers` (lijst), gesorteerd op naam
- Elk item heeft: `naam`, `type`, `actief`
- Geen parameters vereist naast het auth-token
- De GPT filtert zelf op `actief: ja` bij het voorstellen van medewerkers
