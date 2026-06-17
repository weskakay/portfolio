import type { Lang } from './i18n';

export interface Project {
  id: string;
  title: string;
  description: Record<Lang, string>;
  badges: string[];
  type: 'web' | 'maker';
  image: string;
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
    image: '/images/projects/join.png',
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
    image: '/images/projects/pokedex.png',
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
    image: '/images/projects/sakura-ramen.png',
    repoUrl: 'https://github.com/weskakay/sakura_ramen',
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
    image: '/images/projects/t3-tracker.png',
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
    image: '/images/projects/rfid-ble-scanner.png',
  },
];
