import {
  MissingEnvironmentVariableError,
  SupabaseAuthError,
  SupabaseDbError,
  SupabaseMigrationError,
  SupabaseStorageError,
} from '../errors.js';

describe('Custom Errors', () => {
  describe('SupabaseAuthError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseAuthError('Auth failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const errorMessage = 'User not found';
      const error = new SupabaseAuthError(errorMessage);
      expect(error.name).toBe('SupabaseAuthError');
      expect(error.message).toBe(errorMessage);
    });

    it('should store the original error if provided', () => {
      const originalError = new Error('Network issue');
      const error = new SupabaseAuthError('Auth failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('SupabaseDbError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseDbError('DB query failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const errorMessage = 'Table does not exist';
      const error = new SupabaseDbError(errorMessage);
      expect(error.name).toBe('SupabaseDbError');
      expect(error.message).toBe(errorMessage);
    });

    it('should store the error code and original error if provided', () => {
      const originalError = new Error('Connection refused');
      const errorCode = '500';
      const error = new SupabaseDbError('DB query failed', errorCode, originalError);
      expect(error.code).toBe(errorCode);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('SupabaseStorageError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseStorageError('Storage upload failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const errorMessage = 'Bucket not found';
      const error = new SupabaseStorageError(errorMessage);
      expect(error.name).toBe('SupabaseStorageError');
      expect(error.message).toBe(errorMessage);
    });

    it('should store the original error if provided', () => {
      const originalError = new Error('File too large');
      const error = new SupabaseStorageError('Storage upload failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('SupabaseMigrationError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseMigrationError('Migration failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const errorMessage = 'Migration file not found';
      const error = new SupabaseMigrationError(errorMessage);
      expect(error.name).toBe('SupabaseMigrationError');
      expect(error.message).toBe(errorMessage);
    });

    it('should store the original error if provided', () => {
      const originalError = new Error('Database connection error');
      const error = new SupabaseMigrationError('Migration failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('MissingEnvironmentVariableError', () => {
    it('should be an instance of Error', () => {
      const error = new MissingEnvironmentVariableError('VAR_NAME');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const varName = 'SUPABASE_URL';
      const error = new MissingEnvironmentVariableError(varName);
      expect(error.name).toBe('MissingEnvironmentVariableError');
      expect(error.message).toBe(`Missing environment variable: ${varName}`);
    });
  });
});