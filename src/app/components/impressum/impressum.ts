import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

/** Legal notice page (Impressum, § 5 TMG). */
@Component({
  selector: 'app-impressum',
  imports: [RouterLink],
  templateUrl: './impressum.html',
  styleUrl: '../legal.scss',
})
export class Impressum {
  protected readonly lang = inject(LanguageService);
}
