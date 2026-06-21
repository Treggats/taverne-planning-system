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
    return handleDeliveries(e.parameter.datum);
  }

  if (action === 'werkrooster') {
    return handleSchedule(e.parameter.week, e.parameter.datum);
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
    return handleException(body);
  }

  if (action === 'klant') {
    return handleClient(body);
  }

  if (action === 'menu') {
    return handleMenu(body);
  }

  if (action === 'dienst') {
    return handleShift(body);
  }

  if (action === 'week_kopieer') {
    return handleWeekCopy(body);
  }

  if (action === 'medewerker') {
    return handleEmployee(body);
  }

  return handleCreate(body);
}
