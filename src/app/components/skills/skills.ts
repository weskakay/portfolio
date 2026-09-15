import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import type { SkillCategory } from '../../data/i18n';
import { RecordRow, type RecordItem } from '../record-row/record-row';
import { BlueprintArt } from './blueprint-art/blueprint-art';

interface Skill {
  name: string;
  icon: string;
}

interface SkillGroup {
  id: SkillCategory;
  /** Sleeve colour, one of the accent modifiers in the stylesheet. */
  accent: 'lime' | 'blue' | 'purple' | 'magenta' | 'yellow';
  skills: readonly Skill[];
}

/**
 * Skills section: the tech stack sorted into a few records by area. Flipping
 * through the row shows the skills of the active record with their names, so
 * the section never turns into a wall of logos.
 */
@Component({
  selector: 'app-skills',
  imports: [RecordRow, BlueprintArt],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly lang = inject(LanguageService);
  protected readonly active = signal(0);

  protected readonly groups: readonly SkillGroup[] = [
    {
      id: 'frontend',
      accent: 'lime',
      skills: [
        { name: 'HTML5', icon: 'html' },
        { name: 'CSS3', icon: 'css' },
        { name: 'SCSS', icon: 'sass' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Angular', icon: 'angular' },
        { name: 'Ionic', icon: 'ionic' },
        { name: 'Bootstrap', icon: 'bootstrap' },
      ],
    },
    {
      id: 'backend',
      accent: 'blue',
      skills: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Python', icon: 'python' },
        { name: 'Django', icon: 'django' },
        { name: 'PHP', icon: 'php' },
        { name: 'Java', icon: 'java' },
        { name: 'C++', icon: 'cplusplus' },
        { name: 'C#', icon: 'csharp' },
      ],
    },
    {
      id: 'databases',
      accent: 'purple',
      skills: [
        { name: 'MySQL', icon: 'mysql' },
        { name: 'MongoDB', icon: 'mongodb' },
        { name: 'Firebase', icon: 'firebase' },
        { name: 'Supabase', icon: 'supabase' },
        { name: 'PostgreSQL', icon: 'postgresql' },
      ],
    },
    {
      id: 'devops',
      accent: 'magenta',
      skills: [
        { name: 'Git', icon: 'git' },
        { name: 'GitHub', icon: 'github' },
        { name: 'Docker', icon: 'docker' },
        { name: 'Jenkins', icon: 'jenkins' },
        { name: 'AWS', icon: 'aws' },
      ],
    },
    {
      id: 'tools',
      accent: 'yellow',
      skills: [
        { name: 'Figma', icon: 'figma' },
        { name: 'Postman', icon: 'postman' },
        { name: 'VS Code', icon: 'vscode' },
        { name: 'IntelliJ', icon: 'intellij' },
        { name: 'Jira', icon: 'jira' },
        { name: 'Trello', icon: 'trello' },
      ],
    },
  ];

  /** Title and sleeve label of every group in the current language. */
  protected readonly records = computed<RecordItem[]>(() =>
    this.groups.map((group) => ({
      id: group.id,
      title: this.categoryName(group),
      label: this.sleeveLabel(group),
    })),
  );

  protected readonly activeGroup = computed(() => this.groups[this.active()]);

  /** Name of a group's category in the current language. */
  protected categoryName(group: SkillGroup): string {
    return this.lang.dict().skills.categories[group.id];
  }

  /** Sheet number in a sleeve's title block, e.g. "01/05". */
  protected sheet(index: number): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(index + 1)}/${pad(this.groups.length)}`;
  }

  /** Screen reader label of a sleeve, e.g. "Frontend, 8 skills". */
  private sleeveLabel(group: SkillGroup): string {
    return this.lang
      .dict()
      .skills.sleeve.replace('%1', this.categoryName(group))
      .replace('%2', String(group.skills.length));
  }
}
