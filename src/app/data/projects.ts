import type { Lang } from './i18n';

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
  repoUrl?: string;
  highlight?: Record<Lang, string>;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'poll-app',
    title: 'Poll-App',
    description: {
      de: 'Eine Umfrage-App, in der man Abstimmungen erstellt, mitstimmt und die Ergebnisse live mitwachsen sieht.',
      en: 'A survey app where you create polls, cast your vote and watch the results grow in real time.',
    },
    badges: ['Angular', 'TypeScript', 'Supabase', 'SCSS'],
    type: 'web',
    image: '/images/projects/poll-app.png',
    logo: '/images/projects/logos/poll-app.png',
    repoUrl: 'https://github.com/weskakay/poll-app',
  },
  {
    id: 'el-pollo-loco',
    title: 'El Pollo Loco',
    description: {
      de: 'Ein 2D-Jump-and-Run, in dem sich Pepe gegen wütende Hühner und einen Endboss durchschlägt, gebaut mit purem JavaScript und Canvas.',
      en: 'A 2D jump-and-run where Pepe battles angry chickens and a final boss, built with pure JavaScript and Canvas.',
    },
    badges: ['JavaScript', 'Canvas', 'OOP'],
    type: 'web',
    image: '/images/projects/el-pollo-loco.png',
    logo: '/images/projects/logos/el-pollo-loco.svg',
    repoUrl: 'https://github.com/weskakay/el-pollo-loco',
  },
  {
    id: 'join',
    title: 'Join',
    description: {
      de: 'Ein Kanban-Board zum Planen von Aufgaben: anlegen, Personen zuweisen und per Drag-and-drop durch die Spalten ziehen.',
      en: 'A Kanban board for planning tasks: create them, assign people and drag them across the columns.',
    },
    badges: ['JavaScript', 'Firebase'],
    type: 'web',
    image: '/images/projects/logos/join.svg',
    logo: '/images/projects/logos/join.svg',
    repoUrl: 'https://github.com/weskakay/join-415',
  },
  {
    id: 'memory',
    title: 'Memory',
    description: {
      de: 'Ein Memory-Kartenspiel mit mehreren Themes, in dem man Paare aufdeckt und seine Züge im Blick behält.',
      en: 'A memory card game with several themes where you flip cards to find pairs and keep track of your moves.',
    },
    badges: ['TypeScript', 'Vite', 'SCSS'],
    type: 'web',
    image: '/images/projects/memory.png',
    logo: '/images/projects/logos/memory.png',
    repoUrl: 'https://github.com/weskakay/memory',
  },
  {
    id: 'pokedex',
    title: 'Pokedex',
    description: {
      de: 'Ein Pokédex, der über eine offene API durch alle Pokémon blättert, sie durchsucht und ihre Werte anzeigt.',
      en: 'A Pokédex that browses, searches and shows the stats of every Pokémon through an open API.',
    },
    badges: ['JavaScript', 'REST API'],
    type: 'web',
    image: '/images/projects/logos/pokedex.svg',
    logo: '/images/projects/logos/pokedex.svg',
  },
  {
    id: 'sakura-ramen',
    title: 'Sakura Ramen',
    description: {
      de: 'Die Webseite eines fiktiven Ramen-Restaurants mit Speisekarte und Atmosphäre, sauber von Hand mit HTML und CSS gebaut.',
      en: 'The website of a fictional ramen restaurant with menu and atmosphere, hand-built cleanly with HTML and CSS.',
    },
    badges: ['HTML', 'CSS'],
    type: 'web',
    image: '/images/projects/logos/sakura-ramen.svg',
    logo: '/images/projects/logos/sakura-ramen.svg',
    repoUrl: 'https://github.com/weskakay/sakura_ramen',
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
      de: 'Die gesammelten Werte lassen sich als Tag, Woche, Monat und Jahr auswerten, jeweils mit Diagrammen und Verlauf.',
      en: 'The collected readings can be analysed by day, week, month and year, each with charts and trends.',
    },
  },
  {
    id: 't3-tracker',
    title: 'T3 Tracker',
    description: {
      de: 'Ein selbst gebautes Tracking-Gerät für hochwertige Pakete und Versorgungssendungen. Über GPS und Temperatursensoren meldet es in Echtzeit, wo eine Lieferung ist und ob die Kühlkette hält. Die Daten laufen in eine eigene Plattform mit Live-Karte und Ticketsystem.',
      en: 'A self-built tracking device for high-value packages and supply shipments. Using GPS and temperature sensors it reports in real time where a delivery is and whether the cold chain holds. The data feeds a custom platform with a live map and ticket system.',
    },
    badges: ['IoT', 'GPS/GNSS', 'Embedded', 'Python', 'PHP'],
    type: 'maker',
    image: '/images/projects/tracker3.jpg',
    story: {
      afterHeading: '/images/projects/service-design.jpg',
      afterAbout: '/images/projects/tracker5.jpg',
      afterTech: '/images/projects/tracker2.jpg',
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
      de: 'Eine eigene Testfarm, auf der viele Prüfabläufe automatisch laufen und ihre Ergebnisse zentral zusammenfließen.',
      en: 'A dedicated test farm where many test routines run automatically and their results flow together in one place.',
    },
  },
];
