export type Lang = 'de' | 'en';

export interface Dictionary {
  nav: {
    about: string;
    skills: string;
    portfolio: string;
  };
}

export const TRANSLATIONS: Record<Lang, Dictionary> = {
  de: {
    nav: { about: 'Über mich', skills: 'Fähigkeiten', portfolio: 'Portfolio' },
  },
  en: {
    nav: { about: 'About me', skills: 'Skills', portfolio: 'Portfolio' },
  },
};
