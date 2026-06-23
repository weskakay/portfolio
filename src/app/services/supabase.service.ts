import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/** Payload for a contact message stored in the `messages` table. */
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** Provides access to Supabase and stores contact messages. */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient | null = null;

  /** Lazily create the Supabase client on first use. */
  private getClient(): SupabaseClient {
    this.client ??= createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return this.client;
  }

  /** Insert a contact message; throws when Supabase returns an error. */
  async sendContactMessage(payload: ContactMessage): Promise<void> {
    const { error } = await this.getClient().from('messages').insert(payload);
    if (error) {
      throw new Error(error.message);
    }
  }
}
