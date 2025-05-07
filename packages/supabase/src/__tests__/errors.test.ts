import {
  MissingEnvironmentVariableError,
  SupabaseAuthError,
  SupabaseDbError,
  SupabaseError,
  SupabaseMigrationError,
  SupabaseStorageError
} from '../errors.js';

describe('Custom Errors', () => {
  describe('SupabaseError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseError('Base error');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name and message', () => {
      const errorMessage = 'Generic Supabase error';
      const error = new SupabaseError(errorMessage);
      expect(error.name).toBe('SupabaseError');
      expect(error.message).toBe(errorMessage);
    });

    it('should store the original error if provided', () => {
      const originalError = new Error('Original error');
      const error = new SupabaseError('Base error', originalError);
      expect(error.originalError).toBe(originalError);
    });

    it('should maintain proper prototype chain', () => {
      const error = new SupabaseError('Test error');
      expect(Object.getPrototypeOf(error)).toBe(SupabaseError.prototype);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('SupabaseAuthError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseAuthError('Auth failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of SupabaseError', () => {
      const error = new SupabaseAuthError('Auth failed');
      expect(error).toBeInstanceOf(SupabaseError);
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

    it('should maintain proper prototype chain', () => {
      const error = new SupabaseAuthError('Test error');
      expect(Object.getPrototypeOf(error)).toBe(SupabaseAuthError.prototype);
      expect(error instanceof SupabaseAuthError).toBe(true);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('SupabaseDbError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseDbError('DB query failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of SupabaseError', () => {
      const error = new SupabaseDbError('DB query failed');
      expect(error).toBeInstanceOf(SupabaseError);
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

    it('should have undefined code if not provided', () => {
      const error = new SupabaseDbError('DB query failed');
      expect(error.code).toBeUndefined();
    });

    it('should maintain proper prototype chain', () => {
      const error = new SupabaseDbError('Test error');
      expect(Object.getPrototypeOf(error)).toBe(SupabaseDbError.prototype);
      expect(error instanceof SupabaseDbError).toBe(true);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('SupabaseStorageError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseStorageError('Storage upload failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of SupabaseError', () => {
      const error = new SupabaseStorageError('Storage upload failed');
      expect(error).toBeInstanceOf(SupabaseError);
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

    it('should maintain proper prototype chain', () => {
      const error = new SupabaseStorageError('Test error');
      expect(Object.getPrototypeOf(error)).toBe(SupabaseStorageError.prototype);
      expect(error instanceof SupabaseStorageError).toBe(true);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('SupabaseMigrationError', () => {
    it('should be an instance of Error', () => {
      const error = new SupabaseMigrationError('Migration failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of SupabaseError', () => {
      const error = new SupabaseMigrationError('Migration failed');
      expect(error).toBeInstanceOf(SupabaseError);
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

    it('should maintain proper prototype chain', () => {
      const error = new SupabaseMigrationError('Test error');
      expect(Object.getPrototypeOf(error)).toBe(SupabaseMigrationError.prototype);
      expect(error instanceof SupabaseMigrationError).toBe(true);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('MissingEnvironmentVariableError', () => {
    it('should be an instance of Error', () => {
      const error = new MissingEnvironmentVariableError('VAR_NAME');
      expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of SupabaseError', () => {
      const error = new MissingEnvironmentVariableError('VAR_NAME');
      expect(error).toBeInstanceOf(SupabaseError);
    });

    it('should have the correct name and message', () => {
      const varName = 'SUPABASE_URL';
      const error = new MissingEnvironmentVariableError(varName);
      expect(error.name).toBe('MissingEnvironmentVariableError');
      expect(error.message).toBe(`Missing environment variable: ${varName}`);
    });

    it('should maintain proper prototype chain', () => {
      const error = new MissingEnvironmentVariableError('TEST_VAR');
      expect(Object.getPrototypeOf(error)).toBe(MissingEnvironmentVariableError.prototype);
      expect(error instanceof MissingEnvironmentVariableError).toBe(true);
      expect(error instanceof SupabaseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('Error inheritance and stack traces', () => {
    it('should preserve stack traces for all error types', () => {
      const errors = [
        new SupabaseError('Base error'),
        new SupabaseAuthError('Auth error'),
        new SupabaseDbError('DB error'),
        new SupabaseStorageError('Storage error'),
        new SupabaseMigrationError('Migration error'),
        new MissingEnvironmentVariableError('ENV_VAR')
      ];

      for (const error of errors) {
        expect(error.stack).toBeDefined();
        expect(error.stack).toContain(error.name);
        expect(error.stack).toContain(error.message);
      }
    });

    it('should properly chain original errors', () => {
      const originalError = new Error('Original error');
      const errors = [
        new SupabaseError('Base error', originalError),
        new SupabaseAuthError('Auth error', originalError),
        new SupabaseDbError('DB error', undefined, originalError),
        new SupabaseStorageError('Storage error', originalError),
        new SupabaseMigrationError('Migration error', originalError)
      ];

      for (const error of errors) {
        expect(error.originalError).toBe(originalError);
      }
    });
  });
});