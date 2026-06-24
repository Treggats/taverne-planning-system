# Technical Plan

## Components
- `src/werkrooster.js` — `handleSchedule(week, datum)`: normaliseert via
  `normalizeWeek(week, datum)` naar YYYY-WW, leest Diensten-tab via
  `readRows(openScheduleSheet(), 'Diensten')`, filtert op week-label, sorteert
- `src/werkrooster.js` — `normalizeWeek(week, datum)`: accepteert YYYY-WW of
  een datum; bij datum berekent `isoWeekLabel(getMonday(date))`
- `src/main.js` — routing: `GET action=werkrooster → handleSchedule(e.parameter.week, e.parameter.datum)`
