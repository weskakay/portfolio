import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import type { Lang } from '../../data/i18n';

/**
 * Fixed top navigation with section links, a DE/EN language toggle and a
 * burger menu that opens a full-screen overlay.
 *
 * The links only appear once the bar is wide enough for them, see the
 * breakpoint in the stylesheet. Below that everything moves into the menu,
 * which is why no device can make the mark and the links collide.
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

  /** Open or close the overlay menu. */
  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** Close the overlay menu. */
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Set the active UI language. */
  switchLang(code: Lang): void {
    this.lang.setLanguage(code);
  }
}
