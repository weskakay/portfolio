import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

interface Skill {
  name: string;
  icon: string;
}

/** Skills section: a grid of tech logos plus method badges and a short note. */
@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly lang = inject(LanguageService);

  protected readonly skills: readonly Skill[] = [
    { name: 'HTML5', icon: 'html' },
    { name: 'CSS3', icon: 'css' },
    { name: 'SCSS', icon: 'sass' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'Angular', icon: 'angular' },
    { name: 'Ionic', icon: 'ionic' },
    { name: 'Bootstrap', icon: 'bootstrap' },
    { name: 'Node.js', icon: 'nodejs' },
    { name: 'Python', icon: 'python' },
    { name: 'Django', icon: 'django' },
    { name: 'PHP', icon: 'php' },
    { name: 'Java', icon: 'java' },
    { name: 'C++', icon: 'cplusplus' },
    { name: 'C#', icon: 'csharp' },
    { name: 'MySQL', icon: 'mysql' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'Firebase', icon: 'firebase' },
    { name: 'Supabase', icon: 'supabase' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Docker', icon: 'docker' },
    { name: 'Jenkins', icon: 'jenkins' },
    { name: 'AWS', icon: 'aws' },
    { name: 'Figma', icon: 'figma' },
    { name: 'Postman', icon: 'postman' },
    { name: 'VS Code', icon: 'vscode' },
    { name: 'IntelliJ', icon: 'intellij' },
    { name: 'Jira', icon: 'jira' },
    { name: 'Trello', icon: 'trello' },
  ];
}
