// packages/supabase/src/supabaseAuthService.ts

import { AuthResponse, Session, User } from '@supabase/supabase-js';
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
        throw new Error('Email and password are required');
      }

      return await this.client.auth.signUp({
        email,
        password,
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signInWithPassword(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      return await this.client.auth.signInWithPassword({
        email,
        password,
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await this.client.auth.signOut();

      // Manually construct the AuthResponse structure
      return {
        data: { user: null, session: null },
        error: error || null,
      } as AuthResponse;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
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
      return { data: { session: null } };
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
      return { data: { user: null } };
    }
  }
}
