function handleToday() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return response({ date: formatDate(today), entries: getAllEvents(start, end) });
}

function handleWeek(dateString) {
  if (! dateString) {
    return response({ error: 'Missing date parameter' });
  }

  const monday = getMonday(new Date(dateString));
  const sunday = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000);
  return response({ week_start: formatDate(monday), entries: getAllEvents(monday, sunday) });
}

function getAllEvents(start, end) {
  const entries = [];

  for (const [key, name] of Object.entries(CALENDARS)) {
    const calendars = CalendarApp.getCalendarsByName(name);
    if (calendars.length === 0) continue;

    const events = calendars[0].getEvents(start, end);

    for (const event of events) {
      const isAllDay = event.isAllDayEvent();
      const entry = {
        kalender: key,
        naam: event.getTitle(),
        datum: formatDate(event.getStartTime()),
      };

      if (isAllDay) {
        entry.geheel_dag = true;
      } else {
        entry.begin = formatTime(event.getStartTime());
        entry.eind = formatTime(event.getEndTime());
      }

      const desc = event.getDescription();
      if (desc) {
        for (const line of desc.split('\n')) {
          const colonIndex = line.indexOf(': ');
          if (colonIndex !== -1) {
            const field = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 2).trim();
            entry[field] = value;
          }
        }
      }

      entries.push(entry);
    }
  }

  return entries.sort((a, b) =>
    a.datum.localeCompare(b.datum) || (a.begin ?? '').localeCompare(b.begin ?? '')
  );
}
