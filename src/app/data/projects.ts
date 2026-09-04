import type { Lang } from './i18n';

/** One entry of the portfolio, shown as a card and in the detail dialog. */
export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: Record<Lang, string>;
  badges: string[];
  type: 'web' | 'maker';
  image: string;
  logo?: string;
  story?: {
    afterHeading?: string;
    afterAbout?: string;
    afterTech?: string;
    afterHighlight?: string;
  };
  liveUrl?: string;
  /** The live site speaks both languages and takes the choice from the link. */
  followsLanguage?: boolean;
  repoUrl?: string;
  highlight?: Record<Lang, string>;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'poll-app',
    title: 'Poll-App',
    description: {
      de: 'Eine Umfrage-App, in der man Abstimmungen mit mehreren Fragen anlegt, mitstimmt und die Ergebnisse wachsen sieht. Vorne Angular mit Signals, dahinter eine eigene REST-Schnittstelle in PHP auf einer MySQL-Datenbank.',
      en: 'A survey app where you create polls with several questions, cast your vote and watch the results grow. Angular with signals at the front, my own PHP REST API on MySQL behind it.',
    },
    badges: ['Angular', 'TypeScript', 'PHP', 'MySQL', 'SCSS'],
    type: 'web',
    image: '/images/projects/poll-app.jpg',
    logo: '/images/projects/logos/poll-app.svg',
    liveUrl: 'https://poll.weskakay.de',
    repoUrl: 'https://github.com/weskakay/poll-app',
    highlight: {
      de: 'Die Ergebnisse aktualisieren sich von selbst. Statt eine Verbindung offen zu halten, fragt die App alle vier Sekunden nach. Eine abgegebene Stimme erscheint sofort und wird danach vom Server bestätigt.',
      en: 'The results update on their own. Instead of holding a connection open, the app asks again every four seconds. A vote shows up immediately and the server confirms it afterwards.',
    },
  },
  {
    id: 'el-pollo-loco',
    title: 'El Pollo Loco',
    description: {
      de: 'Ein 2D-Jump-and-Run auf HTML5-Canvas. Pepe läuft durch die Wüste, sammelt Münzen und Flaschen, wehrt Hühner ab und stellt sich am Ende dem Endboss. Gebaut mit purem JavaScript, ohne Engine und ohne Framework.',
      en: 'A 2D platformer on HTML5 Canvas. Pepe runs through the desert, collects coins and bottles, fights off chickens and takes on the boss at the end. Built with plain JavaScript, no engine and no framework.',
    },
    badges: ['JavaScript', 'Canvas', 'OOP'],
    type: 'web',
    image: '/images/projects/el-pollo-loco.jpg',
    logo: '/images/projects/logos/el-pollo-loco.svg',
    liveUrl: 'https://pollo.weskakay.de',
    repoUrl: 'https://github.com/weskakay/el-pollo-loco',
    highlight: {
      de: 'Jede Figur ist ein eigenes Objekt mit eigenen Bildfolgen und Trefferflächen. Die zentrale Weltklasse ist in acht Dateien geteilt, je eine für Spielschleife, Zeichnen, Kollisionen, Sammelobjekte, Wurf, Anzeige und Endboss.',
      en: 'Every figure is its own object with its own image sets and hitboxes. The central world class is split across eight files, one each for the game loop, rendering, collisions, collectibles, the throw, the HUD and the boss.',
    },
  },
  {
    id: 'join',
    title: 'J0IN',
    description: {
      de: 'Ein Kanban-Board für eigene Aufgaben und Projekte. Spalten lassen sich umbenennen und ergänzen, Karten tragen Kategorie, Frist, Priorität, Teilaufgaben und zugewiesene Personen und wandern per Ziehen durch die Spalten, am Rechner wie am Handy. Angular vorn, eine eigene PHP-Schnittstelle auf MySQL dahinter.',
      en: 'A Kanban board for my own tasks and projects. Columns can be renamed and added, cards carry a category, due date, priority, subtasks and assignees, and move through the columns by dragging, on a desktop as well as on a phone. Angular on the front, my own PHP API on MySQL behind it.',
    },
    badges: ['Angular', 'TypeScript', 'SCSS', 'PHP', 'MySQL'],
    type: 'web',
    image: '/images/projects/j0in.jpg',
    logo: '/images/projects/logos/j0in.svg',
    liveUrl: 'https://j0in.weskakay.de',
    followsLanguage: true,
    repoUrl: 'https://github.com/weskakay/j0in',
    highlight: {
      de: 'Die Null im Namen ist das Ziel: keine offenen Aufgaben mehr. Beim Laden ist sie ein offener Ring, der sich dreht und erst zur Null wird, wenn das Board da ist. Das ganze Board kommt in einem einzigen Aufruf, samt Spalten, Karten, Teilaufgaben und Kontakten, statt in einem Aufruf je Teil.',
      en: 'The zero in the name is the goal: no open tasks left. While loading it is an open ring that turns and only closes into a zero once the board has arrived. The whole board comes in a single request, columns, cards, subtasks and contacts together, instead of one call per part.',
    },
  },
  {
    id: 'memory',
    title: 'Memory',
    description: {
      de: 'Ein Memory-Kartenspiel für zwei Personen mit vier Themen und drei Feldgrößen. Blau und Orange decken abwechselnd auf, ein Paar bringt einen Punkt und einen weiteren Zug. Geschrieben in striktem TypeScript auf Vite, ohne Framework.',
      en: 'A memory card game for two players with four themes and three board sizes. Blue and Orange take turns, a pair scores a point and buys another turn. Written in strict TypeScript on Vite, without a framework.',
    },
    badges: ['TypeScript', 'Vite', 'SCSS'],
    type: 'web',
    image: '/images/projects/memory.jpg',
    logo: '/images/projects/logos/memory.svg',
    liveUrl: 'https://memory.weskakay.de',
    repoUrl: 'https://github.com/weskakay/memory',
    highlight: {
      de: 'Die Spielregeln liegen in eigenen Klassen, die den Bildschirm nie anfassen. Erst darüber liegt die Darstellung. Deshalb ist ein neues Thema nur ein anderer Satz Symbole und Farben, die Regeln merken davon nichts.',
      en: 'The rules live in their own classes that never touch the screen, with the rendering layered on top. A new theme is therefore just another set of icons and colors, and the rules never notice.',
    },
  },
  {
    id: 'bestellapp',
    title: 'Bestell-App',
    description: {
      de: 'Eine Bestell-App fürs Essen mit drei erfundenen Restaurants: Karte durchstöbern, Gerichte in den Warenkorb legen und Liefer- oder Abholbestellung abschließen. Reines JavaScript, kein Framework und kein Backend.',
      en: 'A food ordering app with three fictional restaurants: browse the menus, fill your cart and place a delivery or pickup order. Plain JavaScript, no framework and no backend.',
    },
    badges: ['JavaScript', 'HTML', 'CSS'],
    type: 'web',
    image: '/images/projects/bestellapp.jpg',
    logo: '/images/projects/logos/bestellapp.png',
    liveUrl: 'https://bestell.weskakay.de',
    repoUrl: 'https://github.com/weskakay/BestellApp',
    highlight: {
      de: 'Ein Warenkorb gehört immer zu genau einem Restaurant. Wer mitten in einer Bestellung wechselt, bekommt erst eine Rückfrage. Lieferkosten und Mindestbestellwert werden bei jeder Änderung neu gerechnet, bis dahin bleibt der Bestellknopf gesperrt.',
      en: 'A cart always belongs to exactly one restaurant, so switching mid-order asks first. Delivery cost and minimum order value are recalculated on every change, and the order button stays locked until the total qualifies.',
    },
  },
  {
    id: 'sakura-ramen',
    title: 'Sakura Ramen',
    description: {
      de: 'Die Webseite eines erfundenen Ramen-Restaurants mit Speisekarte, Bestellablauf und Anfahrt. Von Hand mit HTML und CSS gebaut, dazu etwas JavaScript für Sprachwechsel und Bedienung.',
      en: 'The website of a fictional ramen restaurant with menu, ordering steps and directions. Hand built with HTML and CSS, plus a little JavaScript for the language switch and the controls.',
    },
    badges: ['HTML', 'CSS', 'JavaScript'],
    type: 'web',
    image: '/images/projects/sakura-ramen.jpg',
    logo: '/images/projects/logos/sakura-ramen.svg',
    liveUrl: 'https://sakura.weskakay.de',
    repoUrl: 'https://github.com/weskakay/sakura_ramen',
    highlight: {
      de: 'Die Seite ist vollständig zweisprachig. Alle Texte liegen in einem Verzeichnis, der Wechsel tauscht auch Seitentitel, Beschreibung und Vorlesehinweise aus und merkt sich die Wahl. Die Karte von Google lädt erst nach einem Klick, vorher werden keine Daten übertragen.',
      en: 'The page is fully bilingual. All copy sits in one dictionary, and switching also swaps the page title, the meta description and the aria labels, then remembers the choice. The Google map only loads after a click, so nothing is sent before that.',
    },
  },
  {
    id: 'pokedex',
    title: 'Pokedex',
    description: {
      de: 'Ein Pokédex auf Basis der offenen PokéAPI: durch das Raster blättern, nach Namen suchen und zu jedem Eintrag Typ, Größe und Kampfwerte aufrufen. Die Karten färben sich nach dem Typ des Pokémon.',
      en: 'A Pokédex built on the open PokéAPI: browse the grid, search by name and open any entry for its type, size and battle stats. Cards take their color from the Pokémon type.',
    },
    badges: ['JavaScript', 'REST API'],
    type: 'web',
    image: '/images/projects/pokedex.jpg',
    logo: '/images/projects/logos/pokedex.svg',
    liveUrl: 'https://pokedex.weskakay.de',
    repoUrl: 'https://github.com/weskakay/Pokedex',
    highlight: {
      de: 'Die Suche greift auf alle Einträge zu, nicht nur auf die geladenen. Die Namensliste wird einmal geholt und gemerkt, danach werden nur die Treffer vollständig nachgeladen. Die Detailansicht lässt sich komplett per Tastatur bedienen.',
      en: 'The search covers every entry, not just the loaded ones. The name list is fetched once and cached, and only the matches are then loaded in full. The detail view can be driven entirely from the keyboard.',
    },
  },
  {
    id: 'weather-station',
    title: 'Wetterstation',
    titleEn: 'Weather Station',
    description: {
      de: 'Eine selbst gebaute Wetterstation mit eigener App. Sensoren erfassen Temperatur, Niederschlag und weitere Werte, ein Raspberry Pi rechnet sie um und sammelt sie auf einem eigenen Server. Eine App zeigt alles als Tages-, Wochen-, Monats- und Jahresansicht mit Diagrammen.',
      en: 'A self-built weather station with its own app. Sensors capture temperature, precipitation and more, a Raspberry Pi converts the readings and gathers them on a dedicated server. An app shows everything as day, week, month and year views with charts.',
    },
    badges: ['IoT', 'Sensorik', 'Python', 'PHP', 'Linux', 'Raspberry Pi', 'JavaScript', 'Android'],
    type: 'maker',
    image: '/images/projects/weather-station1.jpg',
    story: {
      afterHeading: '/images/projects/weather-station5.jpg',
      afterAbout: '/images/projects/weather-station2.jpg',
      afterTech: '/images/projects/weather-station4.jpg',
      afterHighlight: '/images/projects/weather-station3.jpg',
    },
    highlight: {
      de: 'Die Sensoren liefern laufend Rohwerte, interessant wird es erst danach. Die Werte werden umgerechnet, zusammengeführt und so aufbereitet, dass sie flüssig und in Echtzeit auf einem Display oder in der App stehen: Temperatur, Niederschlag, Wassertemperatur, Sonnenstunden und mehr, wahlweise als Tag, Woche, Monat oder Jahr mit Diagrammen. Wichtig war mir, dass man das ohne Erklärung versteht und gern draufschaut.',
      en: 'The sensors deliver raw readings continuously, and the interesting part begins after that. The values are converted, combined and prepared so they appear smoothly and in real time on a display or in the app: temperature, precipitation, water temperature, hours of sunshine and more, as a day, week, month or year view with charts. What mattered to me was that you can understand it without an explanation and enjoy looking at it.',
    },
  },
  {
    id: 't3-tracker',
    title: 'T3 Tracker',
    description: {
      de: 'Ein selbst gebautes Tracking-Gerät für Sendungen in Logistik und Postwesen. Über GPS, Temperatur und weitere Sensoren meldet es, wo eine Lieferung gerade ist und ob die Bedingungen eingehalten werden. Die Daten laufen in eine eigene Plattform mit Live-Karte und Ticketsystem. Der Schwerpunkt liegt auf der letzten Meile, denn dort entscheidet sich die Servicequalität und dort fehlen belastbare Daten am häufigsten. Aus den Messwerten werden Laufzeiten, Engpässe auf den Zustellstrecken und konkrete Handlungsempfehlungen. Auffälligkeiten erkennt die Plattform automatisch, etwa wenn eine Sendung von ihrem üblichen Verlauf abweicht, und meldet Abweichungen, Fehler und erfolgreiche Zustellungen von sich aus.',
      en: 'A self-built tracking device for shipments in logistics and postal services. Using GPS, temperature and further sensors it reports where a delivery currently is and whether conditions are being met. The data feeds a custom platform with a live map and a ticket system. The focus is the last mile, because that is where service quality is decided and where reliable data is missing most often. The readings turn into transit times, bottlenecks along delivery routes and concrete recommendations. The platform detects anomalies on its own, for instance when a shipment leaves its usual pattern, and reports deviations, errors and successful deliveries without being asked.',
    },
    badges: ['IoT', 'GPS/GNSS', 'Embedded', 'Python', 'PHP'],
    type: 'maker',
    image: '/images/projects/tracker3.jpg',
    story: {
      afterHeading: '/images/projects/tracker5.jpg',
      afterTech: '/images/projects/tracker2.jpg',
    },
    highlight: {
      de: 'Die eigentliche Aufgabe war der Ausgleich zwischen Batterielaufzeit und Meldefrequenz. Gelöst über ein konfigurierbares Gerät: Weckzyklus, Meldeintervall und die einzelnen Sensoren lassen sich aus der Plattform heraus setzen, von Echtzeit bis stündlich, und Aktualisierungen gehen über Funk an das Gerät. Jeder Einsatzfall bekommt so seine eigene Einstellung, ohne dass jemand die Hardware anfassen muss.',
      en: 'The real task was balancing battery life against reporting frequency. It is solved by making the device configurable: wake cycle, reporting interval and the individual sensors are set from the platform, from real time down to hourly, and updates reach the device over the air. Every deployment gets its own setting without anyone touching the hardware.',
    },
  },
  {
    id: 'rfid-ble-scanner',
    title: 'RFID/BLE Scanner',
    description: {
      de: 'Ein selbst entwickeltes Lesegerät, das in einem definierten Radius alle paar Minuten nach RFID- und BLE-Tags scannt und erkannte Geräte mit Eigenschaften und Batteriestand in Echtzeit an die Plattform meldet. So lässt sich verfolgen, wann eine Sendung von A nach B gelangt.',
      en: 'A self-developed reader that scans a defined radius for RFID and BLE tags every few minutes and reports detected devices, with their properties and battery level, to the platform in real time, so you can track when a shipment moves from A to B.',
    },
    badges: ['IoT', 'RFID', 'BLE', 'C++', 'Python', 'Embedded'],
    type: 'maker',
    image: '/images/projects/rfidble1.jpg',
    story: {
      afterHeading: '/images/projects/rfidble4.jpg',
      afterAbout: '/images/projects/rfidble3.jpg',
      afterTech: '/images/projects/rfidble2.jpg',
    },
    highlight: {
      de: 'Interessant war die Menge. In einem Scan-Fenster antworten viele Tags gleichzeitig, und die Daten kommen verschlüsselt an. Der Radius lässt sich an den Ort anpassen, ein Briefkasten braucht eine andere Reichweite als eine Lagerhalle. Dabei musste die Batterie lange halten und die Messwerte trotzdem stimmen, denn sie wurden gegen unabhängige Auswertungen gegengeprüft.',
      en: 'The interesting part was the volume. Many tags answer inside a single scan window, and the data arrives encrypted. The range adapts to the location, since a letterbox needs a different radius than a warehouse. Battery life had to stay long while the readings stayed correct, because they were checked against independent evaluations.',
    },
  },
  {
    id: 'atf',
    title: 'ATF',
    description: {
      de: 'Ein firmeninternes Framework für automatisierte Tests in der Automobilbranche. Damit lassen sich Teststände, Testfahrten und Prüfabläufe automatisieren, von der Testfarm über Skripte und Steuer-Code bis zur Auswertung. Viele Werkzeuge laufen unter einer Oberfläche zusammen, das macht wiederkehrende Tests schnell und reproduzierbar.',
      en: 'A company-internal framework for automated testing in the automotive field. It automates test benches, test drives and test routines, from the test farm through scripts and control code to evaluation. Many tools come together under one interface, which makes recurring tests fast and reproducible.',
    },
    badges: ['Smoke Test', 'Sensorik', 'Automation', 'Python', 'C++', 'Docker', 'AWS', 'JIRA'],
    type: 'maker',
    image: '/images/projects/atf3.jpg',
    story: {
      afterHeading: '/images/projects/atf2.jpg',
      afterTech: '/images/projects/atf1.jpg',
      afterHighlight: '/images/projects/atf4.jpg',
    },
    highlight: {
      de: 'Der eigentliche Wert liegt nicht im Testen selbst, sondern in dem, was danach passiert. Die Ergebnisse laufen so aufbereitet an die Entwicklung zurück, dass direkt ablesbar ist, was umgesetzt wurde, was davon läuft und was nicht. Aus einem Testlauf werden damit konkrete nächste Schritte statt einer langen Fehlerliste, und niemand muss einen Stand verwerfen und von vorn anfangen.',
      en: 'The real value is not the testing itself but what happens afterwards. Results flow back to the development team prepared so the team can read directly what was implemented, what of it runs and what does not. A test run therefore produces concrete next steps instead of a long list of errors, and nobody has to discard a state and start over.',
    },
  },
];
