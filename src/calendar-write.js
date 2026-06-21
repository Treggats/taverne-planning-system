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

  const [year, month, day] = body.datum.split('-').map(Number);
  const lunchValue = body.lunch === 'ja' ? 'A+B+fruit' : body.lunch;

  const fields = [];
  if (body.organisatie) fields.push(`organisatie: ${body.organisatie}`);
  if (body.locatie) fields.push(`locatie: ${body.locatie}`);
  if (body.aantal) fields.push(`aantal: ${body.aantal}`);
  if (lunchValue) fields.push(`lunch: ${lunchValue}`);
  if (body.notities) fields.push(`notities: ${body.notities}`);

  const description = fields.join('\n');

  if (! body.begin) {
    calendars[0].createAllDayEvent(body.naam, new Date(year, month - 1, day), { description });
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

  calendars[0].createEvent(body.naam, startTime, endTime, {
    description,
    location: body.locatie ?? ''
  });

  return response({ success: true });
}

function handleMenu(body) {
  if (! body.datum) {
    return response({ error: 'Missing field: datum' });
  }

  if (! body.menu) {
    return response({ error: 'Missing field: menu' });
  }

  const calendars = CalendarApp.getCalendarsByName(CALENDARS.taverne);
  if (calendars.length === 0) {
    return response({ error: `Kalender '${CALENDARS.taverne}' niet gevonden` });
  }

  const [year, month, day] = body.datum.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  calendars[0].createAllDayEvent('Menu', date, {
    description: `menu: ${body.menu}`
  });

  return response({ success: true });
}
