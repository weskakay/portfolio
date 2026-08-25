import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

/** Full-screen hint shown only on phones in landscape, asking to rotate back. */
@Component({
  selector: 'app-rotate-hint',
  imports: [],
  templateUrl: './rotate-hint.html',
  styleUrl: './rotate-hint.scss',
})
export class RotateHint {
  protected readonly lang = inject(LanguageService);
}
