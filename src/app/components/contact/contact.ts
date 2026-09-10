import { Component, OnDestroy, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../services/language.service';

type Status = 'idle' | 'sending' | 'success' | 'error';

/** The form controls the template may ask about, so a typo cannot slip through. */
type Field = 'name' | 'email' | 'message' | 'privacy';

/**
 * Contact section with a reactive form (name, email, message, privacy).
 * An error only appears once a field has been left, but it clears again
 * while typing as soon as the input is valid. The confirmation line clears
 * itself after a few seconds.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnDestroy {
  /** How long the confirmation stays before it clears itself. */
  private static readonly SUCCESS_MS = 5000;

  protected readonly lang = inject(LanguageService);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  protected readonly status = signal<Status>('idle');
  private successTimer?: ReturnType<typeof setTimeout>;

  protected readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    message: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    privacy: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
  });

  /** Drop a pending timer so it cannot write to a destroyed view. */
  ngOnDestroy(): void {
    clearTimeout(this.successTimer);
  }

  /** Whether a control should show its error (invalid and already touched). */
  protected showError(control: Field): boolean {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }

  /** Validate and submit the form. */
  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    clearTimeout(this.successTimer);
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
      this.flagSuccess();
    } catch {
      this.status.set('error');
    }
  }

  /** Confirm, empty the form and let the confirmation fade out on its own. */
  private flagSuccess(): void {
    this.status.set('success');
    this.form.reset();
    this.successTimer = setTimeout(() => this.status.set('idle'), Contact.SUCCESS_MS);
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
