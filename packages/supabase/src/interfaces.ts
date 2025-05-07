// packages/supabase/src/interfaces.ts

import {
  AuthResponse,
  GoTrueClient,
  Session, // Import GoTrueClient type
  SupabaseClient,
  User,
} from '@supabase/supabase-js';

// Define the shape of the Supabase client instance
export interface ISupabaseClient extends SupabaseClient {}

// Interface for Database operations
export interface ISupabaseDbService {
  getClient(): ISupabaseClient;
  findMany<T>(table: string, select?: string): Promise<T[] | null>;
  findOne<T>(table: string, match: object): Promise<T | null>;
  insert<T>(table: string, values: object): Promise<T | null>;
  update<T>(table: string, match: object, values: object): Promise<T | null>;
  delete(table: string, match: object): Promise<void>;
}

// Interface for Authentication operations
export interface ISupabaseAuthService {
  getClient(): GoTrueClient; // Use the imported GoTrueClient type
  signUp(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse>;
  signInWithPassword(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse>;
  signOut(): Promise<AuthResponse>;
  getSession(): Promise<{ data: { session: Session | null } }>;
  getUser(): Promise<{ data: { user: User | null } }>;
  // Add other auth methods as needed
}

// Interface for Storage operations
export interface ISupabaseStorageService {
  getClient(): any; // Temporarily use any to unblock build
  upload(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView, // Use more general types
    options?: any
  ): Promise<{ data: { path: string } | null; error: any | null }>;
  download(
    bucketName: string,
    path: string,
    options?: any
  ): Promise<{ data: Blob | null; error: any | null }>;
  list(
    bucketName: string,
    path?: string,
    options?: {
      search?: string;
      limit?: number;
      offset?: number;
      sortBy?: { column?: string; order?: string };
    } // Define a basic options type
  ): Promise<{ data: any[] | null; error: any | null }>;
  update(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView, // Use more general types
    options?: any
  ): Promise<{ data: { path: string } | null; error: any | null }>;
  remove(
    bucketName: string,
    paths: string[]
  ): Promise<{ data: any[] | null; error: any | null }>;
  // Add other storage methods as needed
}
