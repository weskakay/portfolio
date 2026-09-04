import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PROJECTS, type Project } from '../../data/projects';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Portfolio section: a grid of project cards. Every card opens a detail modal
 * on the same page; web projects additionally offer links to their live demo
 * and their code. The modal traps focus and closes on Escape.
 */
@Component({
  selector: 'app-portfolio',
  imports: [],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {
  protected readonly lang = inject(LanguageService);
  protected readonly projects = PROJECTS;
  protected readonly selected = signal<Project | null>(null);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  /** Card that opened the modal, so focus can return to it on close. */
  private trigger: HTMLElement | null = null;

  /** Move focus into the dialog as soon as it is rendered. */
  private readonly focusDialog = effect(() => {
    this.closeButton()?.nativeElement.focus();
  });

  /** Lock page scroll in place while the detail modal is open (no jump). */
  private readonly lockBodyScroll = effect((onCleanup) => {
    if (!this.selected()) return;
    document.documentElement.style.overflowY = 'hidden';
    onCleanup(() => {
      document.documentElement.style.overflowY = '';
    });
  });

  /** Maps a tech badge to its icon file name; badges without an entry show as text. */
  private readonly badgeIcons: Record<string, string> = {
    Angular: 'angular',
    TypeScript: 'typescript',
    JavaScript: 'javascript',
    SCSS: 'sass',
    CSS: 'css',
    HTML: 'html',
    Firebase: 'firebase',
    Vite: 'vite',
    Python: 'python',
    PHP: 'php',
    'C++': 'cplusplus',
    Docker: 'docker',
    AWS: 'aws',
    MySQL: 'mysql',
    JIRA: 'jira',
  };

  /** Icon path for a tech badge, or null when no logo exists for it. */
  iconFor(badge: string): string | null {
    const name = this.badgeIcons[badge];
    return name ? `/tech-icons/${name}.svg` : null;
  }

  /** Display title for the active language, falling back to the default title. */
  titleFor(project: Project): string {
    return this.lang.lang() === 'en' && project.titleEn ? project.titleEn : project.title;
  }

  /**
   * Link to the live site. Sites that speak both languages get the current one
   * handed over, so a visitor keeps reading in the language they started in.
   */
  liveHref(project: Project): string {
    const url = project.liveUrl ?? '';
    return project.followsLanguage ? `${url}/?lang=${this.lang.lang()}` : url;
  }

  /** Open the detail modal and remember the card that opened it. */
  openDetail(project: Project, card: HTMLElement): void {
    this.trigger = card;
    this.selected.set(project);
  }

  /** Close the detail modal and hand focus back to the card. */
  closeDetail(): void {
    this.selected.set(null);
    this.trigger?.focus();
    this.trigger = null;
  }

  /** Escape closes the dialog, Tab keeps focus inside it. */
  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDetail();
      return;
    }
    if (event.key === 'Tab') this.trapFocus(event);
  }

  /** Wrap Tab and Shift+Tab around the ends of the dialog. */
  private trapFocus(event: KeyboardEvent): void {
    const items = this.focusableItems(event.currentTarget as HTMLElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const target = event.shiftKey ? first : last;
    if (document.activeElement !== target) return;
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }

  /** Focusable elements inside the dialog, in document order. */
  private focusableItems(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
  }
}
