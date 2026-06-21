function isAuthenticated(token) {
  return token === AUTH_TOKEN;
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
