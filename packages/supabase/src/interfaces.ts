// packages/supabase/src/interfaces.ts

import {
  AuthResponse,
  Session, // Import GoTrueClient type
  SupabaseClient,
  User
} from '@supabase/supabase-js';

// Define the shape of the Supabase client instance
export interface ISupabaseClient extends SupabaseClient {}

// Interface for Database operations
export interface ISupabaseDbService {
  getClient(): ISupabaseClient;
  findMany<T>(table: string, select?: string): Promise<T[]>;
  findOne<T>(table: string, match: object): Promise<T | null>;
  insert<T>(table: string, values: object): Promise<T>;
  update<T>(table: string, match: object, values: object): Promise<T | null>;
  delete(table: string, match: object): Promise<void>;
}

// Interface for Authentication operations
export interface ISupabaseAuthService {
  getClient(): ISupabaseClient['auth'];
  signUp(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse>;
  signInWithPassword(credentials: {
    email?: string;
    password?: string;
  }): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getSession(): Promise<{ data: { session: Session | null } }>;
  getUser(): Promise<{ data: { user: User | null } }>;
  // Add other auth methods as needed
}

// Interface for Storage operations
export interface ISupabaseStorageService {
  getClient(): ISupabaseClient['storage'];
  upload(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView,
    options?: import('@supabase/storage-js').FileOptions
  ): Promise<{ data: { path: string } | null; error: import('@supabase/storage-js').StorageError | null }>;
  download(
    bucketName: string,
    path: string,
    options?: { transform?: import('@supabase/storage-js').TransformOptions }
  ): Promise<{ data: Blob | null; error: import('@supabase/storage-js').StorageError | null }>;
  list(
    bucketName: string,
    path?: string,
    options?: import('@supabase/storage-js').SearchOptions
  ): Promise<{ data: import('@supabase/storage-js').FileObject[] | null; error: import('@supabase/storage-js').StorageError | null }>;
  update(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView,
    options?: import('@supabase/storage-js').FileOptions
  ): Promise<{ data: { path: string } | null; error: import('@supabase/storage-js').StorageError | null }>;
  remove(
    bucketName: string,
    paths: string[]
  ): Promise<{ data: import('@supabase/storage-js').FileObject[] | null; error: import('@supabase/storage-js').StorageError | null }>;
  // Add other storage methods as needed
}
