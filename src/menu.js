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
