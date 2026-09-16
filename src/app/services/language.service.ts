import { Injectable, computed, effect, signal } from '@angular/core';
import { TRANSLATIONS, type Dictionary, type Lang } from '../data/i18n';

const STORAGE_KEY = 'lang';

/** Language picked on an earlier visit, German when there is none or storage is blocked. */
function storedLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'de';
  } catch {
    return 'de';
  }
}

/**
 * Holds the active UI language as a signal and exposes the matching
 * translation dictionary. Switching the language updates the whole UI
 * without a reload, and the choice is remembered for the next visit.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Currently active UI language. */
  readonly lang = signal<Lang>(storedLang());

  /** Translation dictionary for the active language. */
  readonly dict = computed<Dictionary>(() => TRANSLATIONS[this.lang()]);

  /** Keeps the document language in step, so screen readers pick the right voice. */
  private readonly syncDocumentLang = effect(() => {
    document.documentElement.lang = this.lang();
  });

  /** Switch the active UI language and remember it. */
  setLanguage(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage blocked (private mode): the choice lasts for this visit only
    }
  }
}
