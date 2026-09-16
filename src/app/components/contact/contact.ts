import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
 * A field is only checked when it is left, never while typing. Typing can
 * clear an error that is shown, but it never brings one up. The answer under the button
 * prints itself out like a server response and clears after a few seconds.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  /** How long the confirmation stays before it clears itself. */
  private static readonly SUCCESS_MS = 5000;

  /** Delay per character and the ceiling for the whole answer. */
  private static readonly CHAR_MS = 25;
  private static readonly ANSWER_MS = 1500;

  protected readonly lang = inject(LanguageService);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  protected readonly status = signal<Status>('idle');

  /** Characters of the answer revealed so far, the full sentence stays in the DOM. */
  private readonly revealed = signal(0);
  protected readonly typing = signal(false);

  /** The answer for the current state, in the language that is on screen. */
  private readonly answer = computed(() =>
    this.status() === 'error' ? this.lang.dict().contact.error : this.lang.dict().contact.success,
  );

  /** The part of that answer the typing has reached, so a language switch follows. */
  protected readonly typedText = computed(() => this.answer().slice(0, this.revealed()));

  /** Fields that were invalid when they were last left. */
  private readonly flagged = signal<ReadonlySet<Field>>(new Set());

  private successTimer?: ReturnType<typeof setTimeout>;
  private typeTimer?: ReturnType<typeof setInterval>;

  protected readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [
      Validators.required,
      // stricter than Validators.email, which lets "name@host" without a domain pass
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ]),
    message: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    privacy: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.unflagValid());
  }

  /** Whether a control shows its error: it was invalid when left and still is. */
  protected showError(control: Field): boolean {
    return this.flagged().has(control) && this.form.controls[control].invalid;
  }

  /** Check a field when it loses focus. */
  protected check(control: Field): void {
    if (this.form.controls[control].valid) return;
    this.flagged.update((set) => new Set(set).add(control));
  }

  /** Drop the errors that typing has fixed, so they do not return on the next key. */
  private unflagValid(): void {
    const stillInvalid = [...this.flagged()].filter((c) => this.form.controls[c].invalid);
    if (stillInvalid.length !== this.flagged().size) this.flagged.set(new Set(stillInvalid));
  }

  /** Validate and submit the form. */
  protected async submit(): Promise<void> {
    // the button is disabled then; this still stops a submit that gets through another way
    if (this.form.invalid) return;
    this.clearTimers();
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
      this.typeOut();
    }
  }

  /** Confirm, empty the form and let the confirmation fade out on its own. */
  private flagSuccess(): void {
    this.status.set('success');
    this.form.reset();
    this.typeOut();
    this.successTimer = setTimeout(() => this.status.set('idle'), Contact.SUCCESS_MS);
  }

  /** Reveal the answer character by character, or at once if motion is reduced. */
  private typeOut(): void {
    clearInterval(this.typeTimer);
    const length = this.answer().length;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealed.set(length);
      this.typing.set(false);
      return;
    }
    this.revealed.set(0);
    this.typing.set(true);
    const step = Math.min(Contact.CHAR_MS, Contact.ANSWER_MS / length);
    this.typeTimer = setInterval(() => this.revealNext(), step);
  }

  /** Add the next character and stop once the sentence is complete. */
  private revealNext(): void {
    const next = this.revealed() + 1;
    this.revealed.set(next);
    if (next < this.answer().length) return;
    clearInterval(this.typeTimer);
    this.typing.set(false);
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

  /** Drop pending timers so they cannot write to a destroyed view. */
  private clearTimers(): void {
    clearTimeout(this.successTimer);
    clearInterval(this.typeTimer);
  }
}
