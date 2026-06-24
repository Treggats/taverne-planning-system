# Medewerker toevoegen

## Intent
Registreer een nieuwe medewerker zodat hij beschikbaar is voor het inplannen
van diensten, of werk een bestaande medewerker bij.

## Acceptance criteria
- `POST action=medewerker` met `naam` en `type` voegt de medewerker toe of
  werkt hem bij
- `type` is verplicht: `vast`, `stagiair` of `vrijwilliger`
- Bestaat er al een medewerker met die naam, dan worden zijn gegevens bijgewerkt
- Nieuwe medewerker krijgt standaard `actief: ja`
- Na toevoegen is de medewerker zichtbaar via `GET action=medewerkers`
- Out of scope: medewerker deactiveren (zie `medewerker-deactiveren`)
- Out of scope: medewerker permanent verwijderen
