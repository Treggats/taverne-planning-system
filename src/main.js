function doGet(e) {
  if (! isAuthenticated(e.parameter.token)) {
    return response({ error: 'Unauthorized' });
  }

  const action = e.parameter.action;

  if (action === 'today') {
    return handleToday();
  }

  if (action === 'week') {
    return handleWeek(e.parameter.date);
  }

  if (action === 'bezorgingen') {
    return handleBezorgingen(e.parameter.datum);
  }

  return response({ error: 'Unknown action' });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  if (! isAuthenticated(body.token)) {
    return response({ error: 'Unauthorized' });
  }

  const action = body.action;

  if (action === 'afwijking') {
    return handleAfwijking(body);
  }

  if (action === 'klant') {
    return handleKlant(body);
  }

  if (action === 'menu') {
    return handleMenu(body);
  }

  return handleCreate(body);
}
