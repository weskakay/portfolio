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
  },
};
