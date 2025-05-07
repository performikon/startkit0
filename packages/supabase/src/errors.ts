// packages/supabase/src/errors.ts

/**
 * Base class for all Supabase related errors.
 */
export class SupabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'SupabaseError';
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SupabaseError.prototype);
  }
}

/**
 * Error specifically for Supabase Auth operations.
 */
export class SupabaseAuthError extends SupabaseError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SupabaseAuthError';
    Object.setPrototypeOf(this, SupabaseAuthError.prototype);
  }
}

/**
 * Error specifically for Supabase Database operations.
 */
export class SupabaseDbError extends SupabaseError {
  constructor(message: string, public code?: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SupabaseDbError';
    this.code = code;
    Object.setPrototypeOf(this, SupabaseDbError.prototype);
  }
}

/**
 * Error specifically for Supabase Storage operations.
 */
export class SupabaseStorageError extends SupabaseError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SupabaseStorageError';
    Object.setPrototypeOf(this, SupabaseStorageError.prototype);
  }
}

/**
 * Error specifically for Supabase Migration operations.
 */
export class SupabaseMigrationError extends SupabaseError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SupabaseMigrationError';
    Object.setPrototypeOf(this, SupabaseMigrationError.prototype);
  }
}

/**
 * Error for missing required environment variables.
 */
export class MissingEnvironmentVariableError extends SupabaseError {
  constructor(variableName: string) {
    super(`Missing environment variable: ${variableName}`);
    this.name = 'MissingEnvironmentVariableError';
    Object.setPrototypeOf(this, MissingEnvironmentVariableError.prototype);
  }
}