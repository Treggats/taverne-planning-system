function handleBezorgingen(datumString) {
  if (! datumString) {
    return response({ error: 'Missing datum parameter (YYYY-MM-DD)' });
  }

  const datum = parseDate(datumString);
  const weekdag = WEEKDAGEN[datum.getDay()];

  const klanten = readSheetRows('Klanten');
  const afwijkingen = readSheetRows('Afwijkingen');

  const relevant = afwijkingen.filter(a => afwijkingGeldtVoor(a, datum, weekdag));

  const annuleringen = new Set(
    relevant.filter(a => a.type === 'annulering').map(a => String(a.klant_id))
  );

  const wijzigingen = {};
  for (const a of relevant.filter(a => a.type === 'wijziging')) {
    wijzigingen[String(a.klant_id)] = a;
  }

  const klantenById = {};
  for (const k of klanten) {
    klantenById[String(k.klant_id)] = k;
  }

  const entries = klanten
    .filter(k => String(k.actief).toLowerCase() === 'ja')
    .filter(k => roosterBevat(k.rooster, weekdag))
    .filter(k => ! annuleringen.has(String(k.klant_id)))
    .map(k => buildBezorgEntry(k, wijzigingen[String(k.klant_id)]));

  for (const ex of relevant.filter(a => a.type === 'extra')) {
    const klant = klantenById[String(ex.klant_id)];
    if (! klant) continue;
    entries.push(buildBezorgEntry(klant, ex));
  }

  entries.sort((a, b) =>
    a.tijd.localeCompare(b.tijd) || a.naam.localeCompare(b.naam)
  );

  return response({
    datum: datumString,
    weekdag,
    entries,
  });
}

function afwijkingGeldtVoor(afwijking, datum, weekdag) {
  if (afwijking.datum) {
    const d = toDate(afwijking.datum);
    return d.getFullYear() === datum.getFullYear() &&
           d.getMonth() === datum.getMonth() &&
           d.getDate() === datum.getDate();
  }
  if (afwijking.weekdag) {
    return String(afwijking.weekdag).trim() === weekdag;
  }
  return false;
}

function roosterBevat(rooster, weekdag) {
  if (! rooster) return false;
  return String(rooster).split(',').map(s => s.trim()).indexOf(weekdag) !== -1;
}

function buildBezorgEntry(klant, afwijking) {
  const a = afwijking || {};
  const toetje = (firstSet(a.toetje, klant.vast_toetje) === 'ja') ? 'ja' : 'nee';
  return {
    klant_id: klant.klant_id,
    naam: `${klant.voornaam ?? ''} ${klant.achternaam ?? ''}`.trim(),
    adres: klant.adres ?? '',
    telefoon: klant.telefoon ?? '',
    tijd: asTimeString(firstSet(a.tijd, klant.vaste_bezorgtijd)),
    porties: firstSet(a.porties, klant.porties),
    toetje,
    bezorgwijze: firstSet(a.bezorgwijze, klant.bezorgwijze),
    bezorger: a.bezorger ?? '',
    opmerkingen: klant.bezorg_opmerkingen ?? '',
    dieetwensen: klant.dieetwensen ?? '',
    notitie: a.notitie ?? '',
  };
}

function firstSet(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}
