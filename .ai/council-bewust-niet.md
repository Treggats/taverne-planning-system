# LLM Council — bewust uitgesloten use cases

Vraag aan de raad: *Welke van de vier bewust uitgesloten use cases verdienen
heroverweging, en welke niet?*

Zie `.ai/council.md` voor de methodiek en rolverdeling.

---

## Fase 1 — Initiële standpunten

**Gijs (Gebruiksgemak)**

Twee van de vier gevallen zijn wrijving die ik dagelijks voel. Als ik een
kalender entry heb aangemaakt met de verkeerde tijd, moet ik nu zelf naar
Google Calendar. Dat breekt mijn flow: ik was bezig met de GPT, nu moet ik
schakelen. Hetzelfde voor afwijkingen — als ik een annulering ongedaan wil
maken, kan ik dat niet. Aanpassen en verwijderen van kalender entries zou wel
moeten kunnen, mits ik bevestig wat ik ga doen. Klanten aanpassen laat ik
graag aan Tonko — dat is zelden en vereist kennis van het systeem.

**Vera (Veiligheid & Controle)**

De kalenderregel in CLAUDE.md is er niet voor niets. Antje's kalender wordt
gedeeld met het team; een per ongeluk verwijderd event of een stilletjes
gewijzigde tijd kan operationele gevolgen hebben die niemand opmerkt. Een GPT
maakt fouten bij het interpreteren van "pas die afspraak aan" — welke van de
drie Cosis-entries op dinsdag bedoelt ze? De kans op stille dataverlies is
reëel. Klanten aanpassen is nog gevaarlijker: een roosterwijziging voor een
vaste klant heeft directe impact op bezorgingen. Dit alles hoort in handen van
mensen met context, niet een taalmodel.

**Lars (Technische haalbaarheid)**

Kalender entries aanpassen is technisch triviaal in de Apps Script API —
`updateEvent` bestaat. Hetzelfde voor verwijderen. Het echte probleem is
*identiteit*: hoe identificeer je ondubbelzinnig welk event je bedoelt? Op
datum + naam kun je meerdere hits krijgen. Je hebt een event-ID nodig, maar
die sla je nergens op. Dat lost zichzelf niet op zonder een extra laag (ID's
persisteren, zoekresultaat tonen, keuze laten maken). Klanten aanpassen is
vergelijkbaar: je hebt een zoekstap nodig voor je kunt wijzigen. Afwijking
verwijderen is het makkelijkste — die hebben al een klant_id + datum als sleutel.

**Bas (Beheer & Governance)**

Ik beheer het systeem. De huidige regel beschermt niet alleen data, maar ook
de beheersbaarheid: als de GPT kan wijzigen en verwijderen, wordt het moeilijker
om te achterhalen wat er is veranderd en waarom. Er is geen auditlog. Zolang dat
er niet is, is de drempel voor destructieve acties terecht hoog. Afwijking
verwijderen zou ik wel willen meegeven: dat is low-risk en Antje doet dat nu
handmatig in de sheet terwijl ze de rest via de GPT doet — inconsistent. Klant
aanpassen: nee, te complex en te zeldzaam.

---

## Fase 2 — Evaluatie

**Gijs over de anderen**

Vera is te defensief — een bevestigingsstap lost de meeste risico's al op. Lars'
technische analyse over het identiteitsprobleem bij kalender events is sterk
en overtuigt mij. Bas' observatie over de afwijking en inconsistentie is eerlijk.

**Vera over de anderen**

Gijs' argument is begrijpelijk maar onderschat het identificatieprobleem dat Lars
noemt. Zonder ondubbelzinnige identiteit is "aanpassen" gevaarlijker dan het
lijkt. Bas' observatie over de afwijking is pragmatisch en terecht.

**Lars over de anderen**

Gijs' wens is reëel maar de oplossing vereist meer dan alleen een endpoint —
dat onderschatten Gijs en Vera beiden. Eens met Bas over de afwijking: lage
complexiteit, heldere sleutel.

**Bas over de anderen**

Vera's positie is te absoluut; een goed ontworpen flow met bevestiging vermindert
risico's. Lars' analyse over event-ID is de kern van het probleem — los dat niet
op, doe het dan niet.

---

## Fase 3 — Synthese

| Use case | Advies | Redenering |
|---|---|---|
| Kalender entry **aanpassen** | Niet nu | Identiteitsprobleem (welk event?) niet triviaal oplosbaar; risico op stille fouten te groot zolang er geen event-ID beschikbaar is in de flow |
| Kalender entry **verwijderen** | Niet nu | Zelfde identiteitsprobleem; bovendien irreversibel — hogere drempel gerechtvaardigd |
| Bestaande klant **aanpassen** | Nee | Zeldzaam, complex, vereist domeinkennis; terecht bij Antje/Tonko |
| Bestaande afwijking **verwijderen** | Heroverwegen | Lage impact, ondubbelzinnige sleutel (klant_id + datum), en de enige bewust-niet-case die inconsistent is met de rest van de GPT-workflow |

Sterkste kandidaat voor heroverweging: **afwijking verwijderen** → zie
`.ai/specs/afwijking-verwijderen/`.
