export type Lang = 'de' | 'en';

export interface Dictionary {
  nav: {
    about: string;
    skills: string;
    portfolio: string;
    gallery: string;
    contact: string;
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
  portfolio: {
    heading: string;
    intro: string;
    live: string;
    code: string;
    details: string;
    close: string;
    aboutLabel: string;
    techLabel: string;
    highlightLabel: string;
  };
  gallery: {
    heading: string;
    subtitle: string;
  };
  contact: {
    heading: string;
    lead: string;
    intro: string;
    cta: string;
    ctaContact: string;
    name: string;
    email: string;
    message: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    errName: string;
    errEmail: string;
    errMessage: string;
    errPrivacy: string;
  };
  footer: {
    rights: string;
    impressum: string;
    datenschutz: string;
  };
  legal: {
    back: string;
  };
}

export const TRANSLATIONS: Record<Lang, Dictionary> = {
  de: {
    nav: {
      about: 'Über mich',
      skills: 'Fähigkeiten',
      portfolio: 'Portfolio',
      gallery: 'Galerie',
      contact: 'Kontakt',
    },
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
    portfolio: {
      heading: 'Portfolio',
      intro: 'Eine Auswahl meiner Arbeiten. Klick dich rein und probier sie aus.',
      live: 'Live-Test',
      code: 'GitHub',
      details: 'Details ansehen',
      close: 'Schließen',
      aboutLabel: 'Worum geht es?',
      techLabel: 'Eingesetzte Technologien',
      highlightLabel: 'Highlight',
    },
    gallery: {
      heading: 'ON AND OFF THE PITCH',
      subtitle: 'Sport ist mein Ausgleich. Ein paar Momente auf und neben dem Platz.',
    },
    contact: {
      heading: 'Kontakt',
      lead: 'Hast du ein Projekt?',
      intro:
        'Erzähl mir von deinem Projekt und der Rolle, die du suchst. Ich bringe Erfahrung vom Sensor bis zur Oberfläche mit.',
      cta: 'Du suchst einen Fullstack-Entwickler?',
      ctaContact: 'Schreib mir!',
      name: 'Name',
      email: 'E-Mail',
      message: 'Nachricht',
      privacy: 'Ich bin mit der Verarbeitung meiner Daten gemäß der',
      privacyLink: 'Datenschutzerklärung',
      submit: 'Nachricht senden',
      sending: 'Wird gesendet',
      success: 'Danke, deine Nachricht ist angekommen.',
      error: 'Da ist etwas schiefgelaufen. Bitte versuch es später noch einmal.',
      errName: 'Bitte gib deinen Namen ein.',
      errEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      errMessage: 'Bitte schreib mindestens 10 Zeichen.',
      errPrivacy: 'Bitte stimme der Datenschutzerklärung zu.',
    },
    footer: {
      rights: 'Alle Rechte vorbehalten.',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
    },
    legal: {
      back: 'Zurück zur Startseite',
    },
  },
  en: {
    nav: {
      about: 'About me',
      skills: 'Skills',
      portfolio: 'Portfolio',
      gallery: 'Gallery',
      contact: 'Contact',
    },
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
    portfolio: {
      heading: 'Portfolio',
      intro: 'A selection of my work. Click in and try it out.',
      live: 'Live Test',
      code: 'GitHub',
      details: 'View details',
      close: 'Close',
      aboutLabel: 'About the project',
      techLabel: 'Technologies I used',
      highlightLabel: 'Highlight',
    },
    gallery: {
      heading: 'ON AND OFF THE PITCH',
      subtitle: 'Sport is my balance. A few moments on and off the pitch.',
    },
    contact: {
      heading: 'Contact',
      lead: 'Got a project?',
      intro:
        'Tell me about your project and the role you have in mind. I bring experience from the sensor to the interface.',
      cta: 'Need a Fullstack developer?',
      ctaContact: 'Contact me!',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      privacy: 'I agree to the processing of my data according to the',
      privacyLink: 'privacy policy',
      submit: 'Send message',
      sending: 'Sending',
      success: 'Thanks, your message came through.',
      error: 'Something went wrong. Please try again later.',
      errName: 'Please enter your name.',
      errEmail: 'Please enter a valid email address.',
      errMessage: 'Please write at least 10 characters.',
      errPrivacy: 'Please accept the privacy policy.',
    },
    footer: {
      rights: 'All rights reserved.',
      impressum: 'Legal notice',
      datenschutz: 'Privacy',
    },
    legal: {
      back: 'Back to home',
    },
  },
};
