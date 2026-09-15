import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PROJECTS, projectImages, type Project } from '../../data/projects';
import { ProjectSlider } from './project-slider/project-slider';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Portfolio section: a grid of project cards. Every card opens a detail modal
 * with an image slider, and a project bar at its foot flips on to the
 * neighbours without closing. Web projects offer links to their live demo and
 * their code. The modal traps focus and closes on Escape.
 */
@Component({
  selector: 'app-portfolio',
  imports: [ProjectSlider],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss', './portfolio-modal.scss', './portfolio-nav.scss'],
})
export class Portfolio {
  protected readonly lang = inject(LanguageService);
  protected readonly projects = PROJECTS;
  protected readonly active = signal(0);
  protected readonly isOpen = signal(false);
  protected readonly selected = computed(() => (this.isOpen() ? this.projects[this.active()] : null));
  protected readonly titles = computed(() => this.projects.map((project) => this.titleFor(project)));
  protected readonly images = computed(() => projectImages(this.projects[this.active()]));
  protected readonly prevProject = computed(() => this.projects[this.neighbour(-1)]);
  protected readonly nextProject = computed(() => this.projects[this.neighbour(1)]);
  /** Only filled on a project switch, so opening the dialog is not read out twice. */
  protected readonly announcement = signal('');
  private readonly injector = inject(Injector);
  private readonly cards = viewChildren<ElementRef<HTMLButtonElement>>('card');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');

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

  /** Open the detail modal at the given project. */
  openDetail(index: number): void {
    this.active.set(index);
    this.announcement.set('');
    this.isOpen.set(true);
  }

  /** Close the detail modal and focus the card of the project it ended on. */
  closeDetail(): void {
    this.isOpen.set(false);
    this.cards()[this.active()]?.nativeElement.focus();
  }

  /** Switch to the previous (-1) or next (1) project, wrapping around. */
  switchProject(direction: number): void {
    this.active.set(this.neighbour(direction));
    this.announcement.set(this.positionLabel());
    this.resetScroll();
  }

  /** Screen reader text like "Project 3 of 8: Poll-App". */
  positionLabel(): string {
    return this.lang
      .dict()
      .portfolio.position.replace('%1', String(this.active() + 1))
      .replace('%2', String(this.projects.length))
      .replace('%3', this.titles()[this.active()]);
  }

  /** Escape closes, the arrow keys switch project, Tab keeps focus inside. */
  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') return this.closeDetail();
    if (event.key === 'Tab') return this.trapFocus(event);
    const direction = KEY_STEPS[event.key];
    if (!direction) return;
    event.preventDefault();
    const dialog = event.currentTarget as HTMLElement;
    this.switchProject(direction);
    afterNextRender(() => this.keepFocusIn(dialog), { injector: this.injector });
  }

  /** The next project may lack the link that had focus, so catch focus on the close button. */
  private keepFocusIn(dialog: HTMLElement): void {
    if (dialog.contains(document.activeElement)) return;
    this.closeButton()?.nativeElement.focus();
  }

  /** Index of the project next to the active one, wrapping at the ends. */
  private neighbour(direction: number): number {
    const count = this.projects.length;
    return (this.active() + direction + count) % count;
  }

  /** Back to the top of the new project, with a short fade unless motion is reduced. */
  private resetScroll(): void {
    const el = this.scroller()?.nativeElement;
    if (!el) return;
    el.scrollTop = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
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
