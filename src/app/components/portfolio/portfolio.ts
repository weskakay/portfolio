import { Component, effect, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PROJECTS, type Project } from '../../data/projects';

/**
 * Portfolio section: a two-column grid of project cards. Web projects link
 * to live demo and code; maker projects open a detail modal on the same page.
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

  /** Lock page scroll while the detail modal is open. */
  private readonly lockBodyScroll = effect((onCleanup) => {
    if (!this.selected()) return;
    document.body.style.overflow = 'hidden';
    onCleanup(() => {
      document.body.style.overflow = '';
    });
  });

  private readonly badgeIcons: Record<string, string> = {
    Angular: 'angular',
    TypeScript: 'typescript',
    JavaScript: 'javascript',
    SCSS: 'sass',
    CSS: 'css',
    HTML: 'html',
    Supabase: 'supabase',
    Firebase: 'firebase',
    Vite: 'vite',
    Bootstrap: 'bootstrap',
    Python: 'python',
    PHP: 'php',
    'C++': 'cplusplus',
    Node: 'nodejs',
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

  /** Open the detail modal for a project. */
  openDetail(project: Project): void {
    this.selected.set(project);
  }

  /** Close the detail modal. */
  closeDetail(): void {
    this.selected.set(null);
  }
}
