export type Lang = 'de' | 'en';

export interface Dictionary {
  nav: {
    about: string;
    skills: string;
    portfolio: string;
  };
  hero: {
    iam: string;
    role: string;
    cta: string;
    scroll: string;
    altBusiness: string;
  };
  about: {
    heading: string;
    intro: string;
    location: string;
    learning: string;
    solving: string;
    team: string;
  };
  skills: {
    heading: string;
    intro: string;
    more: string;
    methods: string[];
  };
}

export const TRANSLATIONS: Record<Lang, Dictionary> = {
  de: {
    nav: { about: 'Über mich', skills: 'Fähigkeiten', portfolio: 'Portfolio' },
    hero: {
      iam: 'Ich bin',
      role: 'FULLSTACK DEVELOPER',
      cta: "Let's talk!",
      scroll: 'Runterscrollen',
      altBusiness: 'Kay Weska im Anzug',
    },
    about: {
      heading: 'Über mich',
      intro:
        'Ich bin Kay, Fullstack-Entwickler aus Dresden. Seit über sechs Jahren baue ich Software, die mit Hardware und dem echten Leben zusammenspielt: von IoT-Geräten über automatisierte Testsysteme bis zu kundennahen Web-Apps. Mich reizt das große Ganze, vom Sensor bis zur Oberfläche.',
      location: 'Dresden, offen für Remote-Arbeit und neue Wege.',
      learning: 'Neugierig auf neue Technologien und ständig am Dazulernen.',
      solving: 'Analytisch und ausdauernd: ich suche die Lösung, die wirklich funktioniert.',
      team: 'Im agilen Team Verantwortung übernommen: Produkt und Tickets organisiert, koordiniert und nah am Kunden entschieden.',
    },
    skills: {
      heading: 'Fähigkeiten',
      intro:
        'Von Frontend bis Backend, von Datenbanken bis DevOps. Ich bleibe neugierig und arbeite mich schnell in neue Technologien ein.',
      more: 'Du suchst eine andere Technologie? Kein Problem, ich lerne schnell dazu.',
      methods: ['Scrum', 'Kanban', 'REST API', 'Testautomatisierung', 'IoT', 'OOP'],
    },
  },
  en: {
    nav: { about: 'About me', skills: 'Skills', portfolio: 'Portfolio' },
    hero: {
      iam: 'I am',
      role: 'FULLSTACK DEVELOPER',
      cta: "Let's talk!",
      scroll: 'Scroll down',
      altBusiness: 'Kay Weska in a suit',
    },
    about: {
      heading: 'About me',
      intro:
        "I'm Kay, a fullstack developer from Dresden. For over six years I've built software that works together with hardware and the real world: from IoT devices to automated testing systems to customer-facing web apps. I like to see the whole picture, from the sensor to the interface.",
      location: 'Dresden, open to remote work and new directions.',
      learning: 'Curious about new technologies and always learning.',
      solving: 'Analytical and persistent: I look for the solution that actually works.',
      team: 'Took ownership in agile teams: organized product and tickets, coordinated the work and decided close to the customer.',
    },
    skills: {
      heading: 'Skills',
      intro:
        'From frontend to backend, from databases to DevOps. I stay curious and pick up new technologies quickly.',
      more: 'Looking for another technology? No problem, I learn fast.',
      methods: ['Scrum', 'Kanban', 'REST API', 'Test automation', 'IoT', 'OOP'],
    },
  },
};
