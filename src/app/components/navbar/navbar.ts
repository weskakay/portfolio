import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import type { Lang } from '../../data/i18n';

/**
 * Fixed top navigation with section links, a DE/EN language toggle and a
 * mobile burger menu that opens a full-screen overlay.
 */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly lang = inject(LanguageService);
  protected readonly menuOpen = signal(false);

  /** Open or close the mobile overlay menu. */
  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** Close the mobile overlay menu. */
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Set the active UI language. */
  switchLang(code: Lang): void {
    this.lang.setLanguage(code);
  }
}
