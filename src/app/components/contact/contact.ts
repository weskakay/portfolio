import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../services/language.service';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Contact section with a reactive form (name, email, message, privacy).
 * The three text fields are checked when they are left, not while typing;
 * the checkbox is checked at once, otherwise the send button would stay
 * disabled until focus moved away from it.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly lang = inject(LanguageService);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  protected readonly status = signal<Status>('idle');

  protected readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
    email: this.fb.nonNullable.control('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      ],
      updateOn: 'blur',
    }),
    message: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(10)],
      updateOn: 'blur',
    }),
    privacy: this.fb.nonNullable.control(false, { validators: [Validators.requiredTrue] }),
  });

  /** Whether a control should show its error (invalid and already touched). */
  protected showError(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && c.touched;
  }

  /** Validate and submit the form. */
  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    await this.send();
  }

  /** Post the message to the mail endpoint and reflect the result in `status`. */
  private async send(): Promise<void> {
    try {
      const request = this.http.post(environment.contactEndpoint, this.buildBody(), {
        responseType: 'text',
      });
      await firstValueFrom(request);
      this.status.set('success');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }

  /** Collect the form fields into a multipart body for the endpoint. */
  private buildBody(): FormData {
    const { name, email, message } = this.form.getRawValue();
    const body = new FormData();
    body.append('name', name);
    body.append('email', email);
    body.append('message', message);
    return body;
  }
}
