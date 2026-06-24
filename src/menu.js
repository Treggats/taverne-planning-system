function handleGetMenu(datum) {
  if (!datum) {
    return response({ error: 'Missing parameter: datum' });
  }

  const calendars = CalendarApp.getCalendarsByName(CALENDARS.taverne);
  if (calendars.length === 0) {
    return response({ error: `Kalender '${CALENDARS.taverne}' niet gevonden` });
  }

  const [year, month, day] = datum.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const events = calendars[0].getEvents(start, end);
  const menuEvent = events.find(e => e.isAllDayEvent() && e.getTitle() === 'Menu');

  if (!menuEvent) {
    return response({ datum, menu: null });
  }

  const desc = menuEvent.getDescription();
  const menuText = desc.startsWith('menu: ') ? desc.slice(6).trim() : desc.trim();

  return response({ datum, menu: menuText });
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
