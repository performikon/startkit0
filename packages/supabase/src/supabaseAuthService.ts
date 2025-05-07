// packages/supabase/src/supabaseAuthService.ts

import { AuthResponse, Session, User } from '@supabase/supabase-js';
import { SupabaseAuthError } from './errors.js';
import { ISupabaseAuthService, ISupabaseClient } from './interfaces.js';

export class SupabaseAuthService implements ISupabaseAuthService {
  private client: ISupabaseClient;

  constructor(supabaseClient: ISupabaseClient) {
    this.client = supabaseClient;
  }

  getClient(): ISupabaseClient['auth'] {
    return this.client.auth;
  }

  async signUp(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new SupabaseAuthError('Email and password are required');
      }

      return await this.client.auth.signUp({
        email,
        password,
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw new SupabaseAuthError('Failed to sign up', error);
    }
  }

  async signInWithPassword(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new SupabaseAuthError('Email and password are required');
      }

      return await this.client.auth.signInWithPassword({
        email,
        password,
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw new SupabaseAuthError('Failed to sign in with password', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        throw new SupabaseAuthError('Failed to sign out', error);
      }
      // On successful sign out, no data is returned, so we return void.
    } catch (error) {
       console.error('Error signing out:', error);
       throw new SupabaseAuthError('Failed to sign out', error);
    }
  }

  async getSession(): Promise<{ data: { session: Session | null } }> {
    try {
      const { data, error } = await this.client.auth.getSession();

      if (error) {
        throw error;
      }

      return { data: { session: data.session } };
    } catch (error) {
      console.error('Error getting session:', error);
      throw new SupabaseAuthError('Failed to get session', error);
    }
  }

  async getUser(): Promise<{ data: { user: User | null } }> {
    try {
      const { data, error } = await this.client.auth.getUser();

      if (error) {
        throw error;
      }

      return { data: { user: data.user } };
    } catch (error) {
      console.error('Error getting user:', error);
      throw new SupabaseAuthError('Failed to get user', error);
    }
  }
}
