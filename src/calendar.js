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

function handleCreate(body) {
  const required = ['kalender', 'datum', 'naam'];

  for (const field of required) {
    if (body[field] === undefined || body[field] === '') {
      return response({ error: `Missing field: ${field}` });
    }
  }

  if (! CALENDARS[body.kalender]) {
    return response({ error: 'kalender moet taverne, mspa of jules zijn' });
  }

  const calendars = CalendarApp.getCalendarsByName(CALENDARS[body.kalender]);
  if (calendars.length === 0) {
    return response({ error: `Kalender '${CALENDARS[body.kalender]}' niet gevonden` });
  }

  if (body.herhaling && RECURRENCE_TYPES.indexOf(body.herhaling) === -1) {
    return response({ error: `herhaling moet ${RECURRENCE_TYPES.join(', ')} zijn` });
  }

  const [year, month, day] = body.datum.split('-').map(Number);
  const lunchValue = body.lunch === 'ja' ? 'A+B+fruit' : body.lunch;

  const fields = [];
  if (body.organisatie) fields.push(`organisatie: ${body.organisatie}`);
  if (body.locatie) fields.push(`locatie: ${body.locatie}`);
  if (body.aantal) fields.push(`aantal: ${body.aantal}`);
  if (lunchValue) fields.push(`lunch: ${lunchValue}`);
  if (body.notities) fields.push(`notities: ${body.notities}`);

  const description = fields.join('\n');
  const recurrence = body.herhaling ? buildRecurrence(body.herhaling, body.herhaling_tot) : null;
  const calendar = calendars[0];

  if (! body.begin) {
    const startDate = new Date(year, month - 1, day);
    if (recurrence) {
      calendar.createAllDayEventSeries(body.naam, startDate, recurrence, { description });
    } else {
      calendar.createAllDayEvent(body.naam, startDate, { description });
    }
    return response({ success: true });
  }

  const [startH, startM] = body.begin.split(':').map(Number);
  const startTime = new Date(year, month - 1, day, startH, startM);

  let endTime;
  if (body.eind) {
    const [endH, endM] = body.eind.split(':').map(Number);
    endTime = new Date(year, month - 1, day, endH, endM);
  } else {
    endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  }

  const options = { description, location: body.locatie ?? '' };
  if (recurrence) {
    calendar.createEventSeries(body.naam, startTime, endTime, recurrence, options);
  } else {
    calendar.createEvent(body.naam, startTime, endTime, options);
  }

  return response({ success: true });
}

function buildRecurrence(herhaling, totString) {
  const recurrence = CalendarApp.newRecurrence();
  let rule;

  if (herhaling === 'dagelijks') {
    rule = recurrence.addDailyRule();
  } else if (herhaling === 'wekelijks') {
    rule = recurrence.addWeeklyRule();
  } else if (herhaling === 'tweewekelijks') {
    rule = recurrence.addWeeklyRule().interval(2);
  } else if (herhaling === 'maandelijks') {
    rule = recurrence.addMonthlyRule();
  }

  if (totString) {
    const [y, m, d] = String(totString).split('-').map(Number);
    rule.until(new Date(y, m - 1, d));
  }

  return recurrence;
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
