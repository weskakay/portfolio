import { Injectable, computed, effect, signal } from '@angular/core';
import { TRANSLATIONS, type Dictionary, type Lang } from '../data/i18n';

/**
 * Holds the active UI language as a signal and exposes the matching
 * translation dictionary. Switching the language updates the whole UI
 * without a reload.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Currently active UI language. */
  readonly lang = signal<Lang>('de');

  /** Translation dictionary for the active language. */
  readonly dict = computed<Dictionary>(() => TRANSLATIONS[this.lang()]);

  /** Keeps the document language in step, so screen readers pick the right voice. */
  private readonly syncDocumentLang = effect(() => {
    document.documentElement.lang = this.lang();
  });

  /** Switch the active UI language. */
  setLanguage(lang: Lang): void {
    this.lang.set(lang);
  }
}
