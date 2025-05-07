// Simple script to verify error classes functionality
import {
  MissingEnvironmentVariableError,
  SupabaseAuthError,
  SupabaseDbError,
  SupabaseMigrationError,
  SupabaseStorageError,
} from './errors-impl.js';

console.log('Starting error classes verification...');

// Test SupabaseAuthError
try {
  const authError = new SupabaseAuthError('Auth failed');
  console.log('SupabaseAuthError created successfully');
  console.log(`Name: ${authError.name}`);
  console.log(`Message: ${authError.message}`);

  const authErrorWithOriginal = new SupabaseAuthError('Auth failed', new Error('Original error'));
  console.log('SupabaseAuthError with original error created successfully');
  console.log(`Original error: ${authErrorWithOriginal.originalError.message}`);
} catch (error) {
  console.error('SupabaseAuthError test failed:', error);
}

// Test SupabaseDbError
try {
  const dbError = new SupabaseDbError('DB query failed');
  console.log('SupabaseDbError created successfully');
  console.log(`Name: ${dbError.name}`);
  console.log(`Message: ${dbError.message}`);

  const dbErrorWithCode = new SupabaseDbError(
    'DB query failed',
    '500',
    new Error('Original error'),
  );
  console.log('SupabaseDbError with code and original error created successfully');
  console.log(`Code: ${dbErrorWithCode.code}`);
  console.log(`Original error: ${dbErrorWithCode.originalError.message}`);
} catch (error) {
  console.error('SupabaseDbError test failed:', error);
}

// Test SupabaseStorageError
try {
  const storageError = new SupabaseStorageError('Storage upload failed');
  console.log('SupabaseStorageError created successfully');
  console.log(`Name: ${storageError.name}`);
  console.log(`Message: ${storageError.message}`);

  const storageErrorWithOriginal = new SupabaseStorageError(
    'Storage upload failed',
    new Error('Original error'),
  );
  console.log('SupabaseStorageError with original error created successfully');
  console.log(`Original error: ${storageErrorWithOriginal.originalError.message}`);
} catch (error) {
  console.error('SupabaseStorageError test failed:', error);
}

// Test SupabaseMigrationError
try {
  const migrationError = new SupabaseMigrationError('Migration failed');
  console.log('SupabaseMigrationError created successfully');
  console.log(`Name: ${migrationError.name}`);
  console.log(`Message: ${migrationError.message}`);

  const migrationErrorWithOriginal = new SupabaseMigrationError(
    'Migration failed',
    new Error('Original error'),
  );
  console.log('SupabaseMigrationError with original error created successfully');
  console.log(`Original error: ${migrationErrorWithOriginal.originalError.message}`);
} catch (error) {
  console.error('SupabaseMigrationError test failed:', error);
}

// Test MissingEnvironmentVariableError
try {
  const envError = new MissingEnvironmentVariableError('SUPABASE_URL');
  console.log('MissingEnvironmentVariableError created successfully');
  console.log(`Name: ${envError.name}`);
  console.log(`Message: ${envError.message}`);
} catch (error) {
  console.error('MissingEnvironmentVariableError test failed:', error);
}

console.log('Error classes verification completed');
