# Technical Plan

## Components
- `src/werkrooster.js` — `handleWeekCopy(body)`: normaliseert bron- en doelweek
  via `normalizeWeek()`, controleert of doelweek leeg is, leest alle rijen van
  bronweek en schrijft ze naar doelweek met het nieuwe week-label
- `src/main.js` — routing: `POST action=week_kopieer → handleWeekCopy(body)`
