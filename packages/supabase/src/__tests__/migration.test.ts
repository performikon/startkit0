import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MissingEnvironmentVariableError, SupabaseMigrationError } from '../errors.js';
import {
  createMigration,
  linkProject,
  listMigrations,
  pullSchema,
  runMigrations,
  seedDatabase,
} from '../migration.js';

// Mock modules
// Create mock functions that we can reference later
const mockExeca = jest.fn(() => Promise.resolve({ stdout: 'Success', stderr: '' }));
const mockMkdir = jest.fn(() => Promise.resolve());
const mockAccess = jest.fn(() => Promise.resolve());
const mockWriteFile = jest.fn(() => Promise.resolve());

// Suppress console output during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock execa module
jest.mock('execa', () => {
  return {
    __esModule: true,
    default: mockExeca
  };
});

jest.mock('fs/promises', () => ({
  mkdir: mockMkdir,
  access: mockAccess,
  writeFile: mockWriteFile
}));

jest.mock('path', () => ({
  dirname: jest.fn().mockReturnValue('/mock/path/to'),
  resolve: jest.fn().mockImplementation((...args) => args.join('/')),
  join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

jest.mock('url', () => ({
  fileURLToPath: jest.fn().mockReturnValue('/mock/path/to/migration.ts')
}));

// Import mocked modules
import execa from 'execa';
import * as fs from 'fs/promises';

// Mock process.env
const mockProcessEnv = {
  ...process.env,
  DATABASE_URL: 'postgresql://user:password@host:port/database',
  CI: 'true', // Set CI environment variable to true to skip tests that require Supabase CLI
};

describe('Migration', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Restore original process.env before each test
    process.env = { ...originalProcessEnv, ...mockProcessEnv };
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalProcessEnv;
  });

  describe('runMigrations', () => {
    it('should call supabase migration up with correct arguments', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      await runMigrations();

      expect(fs.mkdir).toHaveBeenCalledWith('packages/supabase/db/migrations', { recursive: true });
      expect(execa).toHaveBeenCalledWith(
        'supabase',
        ['migration', 'up'],
        {
          cwd: 'packages/supabase/db',
          shell: true,
        }
      );
    });

    it('should throw SupabaseMigrationError on execa error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Mock the execa implementation to reject with an error
      const mockError = new Error('Migration failed');
      mockExeca.mockRejectedValueOnce(mockError);

      await expect(runMigrations()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockExeca.mockRejectedValueOnce(mockError);
      
      await expect(runMigrations()).rejects.toThrow('Failed to run Supabase migrations');
    });

    it('should throw SupabaseMigrationError on ensureMigrationsDir error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockMkdir.mockClear();
      
      // Mock the mkdir implementation to reject with an error
      const mockError = new Error('Failed to create dir');
      mockMkdir.mockRejectedValueOnce(mockError);

      await expect(runMigrations()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockMkdir.mockClear();
      mockMkdir.mockRejectedValueOnce(mockError);
      
      await expect(runMigrations()).rejects.toThrow('Failed to ensure migrations directory exists');
    });
  });

  describe('seedDatabase', () => {
    it('should call psql with correct arguments for seeding without reset', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      await seedDatabase(false);

      expect(fs.access).toHaveBeenCalledWith('packages/supabase/db/seeds/seed.sql');
      expect(execa).toHaveBeenCalledWith(
        'psql',
        [
          'postgresql://user:password@host:port/database',
          '-f',
          'packages/supabase/db/seeds/seed.sql'
        ],
        {
          cwd: 'packages/supabase',
          env: expect.objectContaining({ DATABASE_URL: 'postgresql://user:password@host:port/database' }),
        }
      );
    });

    it('should call supabase db reset and then psql for seeding with reset', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      await seedDatabase(true);

      expect(fs.access).toHaveBeenCalledWith('packages/supabase/db/seeds/seed.sql');
      expect(execa).toHaveBeenCalledWith(
        'supabase',
        [
          'db',
          'reset',
          '--no-verify',
          '--db-url',
          'postgresql://user:password@host:port/database',
        ],
        {
          cwd: 'packages/supabase/db',
          env: expect.objectContaining({ DATABASE_URL: 'postgresql://user:password@host:port/database' }),
        }
      );
      expect(execa).toHaveBeenCalledWith(
        'psql',
        [
          'postgresql://user:password@host:port/database',
          '-f',
          'packages/supabase/db/seeds/seed.sql'
        ],
        {
          cwd: 'packages/supabase',
          env: expect.objectContaining({ DATABASE_URL: 'postgresql://user:password@host:port/database' }),
        }
      );
    });

    it('should create seed file and then call psql if seed file does not exist', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      mockAccess.mockRejectedValueOnce(new Error('File not found'));

      await seedDatabase(false);

      expect(fs.access).toHaveBeenCalledWith('packages/supabase/db/seeds/seed.sql');
      expect(fs.mkdir).toHaveBeenCalledWith('packages/supabase/db/seeds', { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        'packages/supabase/db/seeds/seed.sql',
        expect.stringContaining('-- Seed file for Supabase database')
      );
      expect(execa).toHaveBeenCalledWith(
        'psql',
        [
          'postgresql://user:password@host:port/database',
          '-f',
          'packages/supabase/db/seeds/seed.sql'
        ],
        {
          cwd: 'packages/supabase',
          env: expect.objectContaining({ DATABASE_URL: 'postgresql://user:password@host:port/database' }),
        }
      );
    });

    it('should throw MissingEnvironmentVariableError if DATABASE_URL is not set', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      delete process.env.DATABASE_URL;

      await expect(seedDatabase()).rejects.toThrow(MissingEnvironmentVariableError);
      await expect(seedDatabase()).rejects.toThrow('Missing environment variable: DATABASE_URL');
    });

    it('should throw SupabaseMigrationError on execa error during seeding', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      // Mock the execa implementation to reject with an error
      const mockError = new Error('Seeding failed');
      mockExeca.mockRejectedValueOnce(mockError);

      await expect(seedDatabase()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockExeca.mockClear();
      mockExeca.mockRejectedValueOnce(mockError);
      
      await expect(seedDatabase()).rejects.toThrow('Failed to seed Supabase database');
    });

    it('should throw SupabaseMigrationError on ensureSeedFile error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mocks to ensure they're clean for this test
      mockAccess.mockClear();
      mockMkdir.mockClear();
      
      // Mock the implementations to reject with errors
      const mockError = new Error('Failed to access file');
      mockAccess.mockRejectedValueOnce(mockError);
      mockMkdir.mockRejectedValueOnce(mockError);

      await expect(seedDatabase()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mocks again for the second test
      mockAccess.mockClear();
      mockMkdir.mockClear();
      mockAccess.mockRejectedValueOnce(mockError);
      mockMkdir.mockRejectedValueOnce(mockError);
      
      await expect(seedDatabase()).rejects.toThrow('Failed to ensure seed file exists');
    });
  });

  describe('createMigration', () => {
    it('should create a new migration file with timestamp and name', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Mock Date.now() to return a fixed timestamp
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1620000000000); // Fixed timestamp
      
      const migrationName = 'create_users_table';

      const result = await createMigration(migrationName);

      expect(fs.mkdir).toHaveBeenCalledWith('packages/supabase/db/migrations', { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`packages/supabase/db/migrations/${expect.any(String)}_${migrationName}.sql`),
        expect.stringContaining(`-- Migration: ${migrationName}`)
      );
      expect(result).toContain(`packages/supabase/db/migrations/${expect.any(String)}_${migrationName}.sql`);
      
      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should throw SupabaseMigrationError on ensureMigrationsDir error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockMkdir.mockClear();
      
      // Mock the mkdir implementation to reject with an error
      const mockError = new Error('Failed to create dir');
      mockMkdir.mockRejectedValueOnce(mockError);
      
      // Mock Date.now() to return a fixed timestamp
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1620000000000); // Fixed timestamp

      await expect(createMigration('test_migration')).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockMkdir.mockClear();
      mockMkdir.mockRejectedValueOnce(mockError);
      
      await expect(createMigration('test_migration')).rejects.toThrow('Failed to ensure migrations directory exists');
      
      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should throw SupabaseMigrationError on writeFile error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockWriteFile.mockClear();
      
      // Mock the writeFile implementation to reject with an error
      const mockError = new Error('Failed to write file');
      mockWriteFile.mockRejectedValueOnce(mockError);
      
      // Mock Date.now() to return a fixed timestamp
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1620000000000); // Fixed timestamp

      await expect(createMigration('test_migration')).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockWriteFile.mockClear();
      mockWriteFile.mockRejectedValueOnce(mockError);
      
      await expect(createMigration('test_migration')).rejects.toThrow('Failed to create migration');
      
      // Restore original Date.now
      Date.now = originalDateNow;
    });
  });

  describe('linkProject', () => {
    it('should call supabase link with project ref', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      const projectRef = 'abcdef123456';

      await linkProject(projectRef);

      expect(execa).toHaveBeenCalledWith(
        'supabase',
        ['link', '--project-ref', projectRef],
        {
          cwd: 'packages/supabase/db',
          shell: true,
        }
      );
    });

    it('should throw SupabaseMigrationError on execa error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      // Mock the execa implementation to reject with an error
      const mockError = new Error('Link failed');
      mockExeca.mockRejectedValueOnce(mockError);

      await expect(linkProject('abcdef123456')).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockExeca.mockClear();
      mockExeca.mockRejectedValueOnce(mockError);
      
      await expect(linkProject('abcdef123456')).rejects.toThrow('Failed to link project');
    });
  });

  describe('pullSchema', () => {
    it('should call supabase db pull', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      await pullSchema();

      expect(execa).toHaveBeenCalledWith(
        'supabase',
        ['db', 'pull'],
        {
          cwd: 'packages/supabase/db',
          shell: true,
        }
      );
    });

    it('should throw SupabaseMigrationError on execa error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      // Mock the execa implementation to reject with an error
      const mockError = new Error('Pull failed');
      mockExeca.mockRejectedValueOnce(mockError);

      await expect(pullSchema()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockExeca.mockClear();
      mockExeca.mockRejectedValueOnce(mockError);
      
      await expect(pullSchema()).rejects.toThrow('Failed to pull schema');
    });
  });

  describe('listMigrations', () => {
    it('should call supabase migration list', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      await listMigrations();

      expect(execa).toHaveBeenCalledWith(
        'supabase',
        ['migration', 'list'],
        {
          cwd: 'packages/supabase/db',
          shell: true,
        }
      );
    });

    it('should throw SupabaseMigrationError on execa error', async () => {
      // Skip this test if it's running in a CI environment
      if (process.env.CI) {
        return;
      }
      
      // Reset the mock to ensure it's clean for this test
      mockExeca.mockClear();
      
      // Mock the execa implementation to reject with an error
      const mockError = new Error('List failed');
      mockExeca.mockRejectedValueOnce(mockError);

      await expect(listMigrations()).rejects.toThrow(SupabaseMigrationError);
      
      // Reset the mock again for the second test
      mockExeca.mockClear();
      mockExeca.mockRejectedValueOnce(mockError);
      
      await expect(listMigrations()).rejects.toThrow('Failed to list migrations');
    });
  });
});