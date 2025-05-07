// packages/supabase/src/migration.ts

import execa from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MissingEnvironmentVariableError, SupabaseMigrationError } from './errors.js';

/**
 * Custom error for when the Supabase CLI is not installed or accessible
 */
export class SupabaseCliNotFoundError extends SupabaseMigrationError {
  constructor() {
    super('Supabase CLI not found. Please install it using: npm install -g supabase');
    this.name = 'SupabaseCliNotFoundError';
    Object.setPrototypeOf(this, SupabaseCliNotFoundError.prototype);
  }
}

/**
 * Custom error for when a migration reversion fails
 */
export class MigrationReversionError extends SupabaseMigrationError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'MigrationReversionError';
    Object.setPrototypeOf(this, MigrationReversionError.prototype);
  }
}

/**
 * Represents the status of a migration
 */
export enum MigrationStatus {
  APPLIED = 'applied',
  PENDING = 'pending'
}

/**
 * Interface representing a migration with its status
 */
export interface Migration {
  name: string;
  path: string;
  status: MigrationStatus;
  appliedAt?: Date;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseDir = path.resolve(__dirname, '../'); // Path to the supabase directory
const migrationsDir = path.resolve(supabaseDir, 'db/migrations');
const seedFilePath = path.resolve(supabaseDir, 'db/seeds/seed.sql');
const configDir = path.resolve(supabaseDir, 'db'); // Updated path to the config directory

/**
 * Validates that the Supabase CLI is installed and accessible
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not found
 */
export async function validateSupabaseCli(): Promise<void> {
  try {
    await execa('supabase', ['--version'], { shell: true });
  } catch (error) {
    console.error('Supabase CLI not found:', error);
    throw new SupabaseCliNotFoundError();
  }
}

/**
 * Runs all pending Supabase migrations
 */
/**
 * Runs all pending Supabase migrations
 *
 * This function applies all pending migrations in the db/migrations directory.
 * It first validates that the Supabase CLI is installed and ensures the migrations
 * directory exists before running the migrations.
 *
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not installed
 * @throws {SupabaseMigrationError} If there's an error running the migrations
 * @returns {Promise<void>} A promise that resolves when migrations are complete
 * @example
 * // Run all pending migrations
 * await runMigrations();
 */
export async function runMigrations() {
  console.log('Running Supabase migrations...');
  try {
    // Validate Supabase CLI is installed
    await validateSupabaseCli();
    
    // Ensure migrations directory exists
    await ensureMigrationsDir();
    
    // Apply pending migrations in the db/migrations directory
    const { stdout, stderr } = await execa(
      'supabase',
      ['migration', 'up'],
      {
        cwd: configDir, // Use the updated config directory path
        shell: true,
      }
    );
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    console.log('Supabase migrations finished.');
  } catch (error) {
    console.error('Error running Supabase migrations:', error);
    throw new SupabaseMigrationError('Failed to run Supabase migrations', error);
  }
}

/**
 * Seeds the database with initial data from seed.sql
 * @param reset If true, resets the database before seeding (destructive)
 */
/**
 * Seeds the database with initial data from seed.sql
 *
 * This function applies the SQL in the db/seeds/seed.sql file to the database.
 * If the seed file doesn't exist, it will be created automatically.
 * When reset is true, it will first reset the database (destructive operation)
 * before applying the seed file.
 *
 * @param {boolean} reset - If true, resets the database before seeding (destructive)
 * @throws {MissingEnvironmentVariableError} If DATABASE_URL is not set
 * @throws {SupabaseMigrationError} If there's an error seeding the database
 * @returns {Promise<void>} A promise that resolves when seeding is complete
 * @example
 * // Seed the database without resetting
 * await seedDatabase();
 *
 * // Reset the database and then seed it
 * await seedDatabase(true);
 */
export async function seedDatabase(reset = false) {
  console.log('Seeding Supabase database...');
  if (!process.env.DATABASE_URL) {
    throw new MissingEnvironmentVariableError('DATABASE_URL');
  }
  
  try {
    // Ensure seed file exists
    await ensureSeedFile();
    
    if (reset) {
      // Reset database (destructive operation)
      console.warn('WARNING: Resetting database. All data will be lost.');
      const { stdout: resetStdout, stderr: resetStderr } = await execa(
        'supabase',
        [
          'db',
          'reset',
          '--no-verify',
          '--db-url',
          process.env.DATABASE_URL,
        ],
        {
          cwd: configDir, // Use the updated config directory path
          env: {
            ...process.env,
            DATABASE_URL: process.env.DATABASE_URL,
          },
        }
      );
      
      if (resetStdout) console.log(resetStdout);
      if (resetStderr) console.error(resetStderr);
    } else {
      // Apply seed file without resetting
      const { stdout, stderr } = await execa(
        'psql',
        [
          process.env.DATABASE_URL,
          '-f',
          seedFilePath
        ],
        {
          cwd: supabaseDir,
          env: {
            ...process.env,
            DATABASE_URL: process.env.DATABASE_URL,
          },
        }
      );
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
    
    console.log('Supabase database seeding finished.');
  } catch (error) {
    console.error('Error seeding Supabase database:', error);
    throw new SupabaseMigrationError('Failed to seed Supabase database', error);
  }
}

/**
 * Creates a new migration file
 * @param name Name of the migration
 * @returns Path to the created migration file
 */
/**
 * Creates a new migration file
 *
 * This function creates a new SQL migration file in the db/migrations directory
 * with a timestamp prefix and the provided name. The file will contain a basic
 * template for writing SQL migrations.
 *
 * @param {string} name - Name of the migration (e.g., 'create_users_table')
 * @throws {SupabaseMigrationError} If there's an error creating the migration file
 * @returns {Promise<string>} Path to the created migration file
 * @example
 * // Create a new migration
 * const migrationPath = await createMigration('create_users_table');
 * console.log(`Migration created at: ${migrationPath}`);
 */
export async function createMigration(name: string): Promise<string> {
  console.log(`Creating new migration: ${name}`);
  try {
    // Ensure migrations directory exists
    await ensureMigrationsDir();
    
    // Generate timestamp for migration filename
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const migrationName = `${timestamp}_${name.replace(/\s+/g, '_').toLowerCase()}`;
    
    // Create migration file
    const migrationPath = path.join(migrationsDir, `${migrationName}.sql`);
    await fs.writeFile(
      migrationPath,
      `-- Migration: ${name}\n-- Created at: ${new Date().toISOString()}\n\n-- Write your SQL here\n`
    );
    
    console.log(`Migration created at: ${migrationPath}`);
    return migrationPath;
  } catch (error) {
    console.error('Error creating migration:', error);
    throw new SupabaseMigrationError('Failed to create migration', error);
  }
}

/**
 * Links the local Supabase project to a remote Supabase project
 * @param projectRef Supabase project reference ID
 */
/**
 * Links the local Supabase project to a remote Supabase project
 *
 * This function links your local Supabase configuration to a remote Supabase project
 * using the project reference ID. This is required for operations that interact with
 * a remote Supabase instance, such as pulling schemas or pushing migrations.
 *
 * @param {string} projectRef - Supabase project reference ID
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not installed
 * @throws {SupabaseMigrationError} If there's an error linking the project
 * @returns {Promise<void>} A promise that resolves when the project is linked
 * @example
 * // Link to a remote Supabase project
 * await linkProject('abcdef123456');
 */
export async function linkProject(projectRef: string) {
  console.log(`Linking to Supabase project: ${projectRef}`);
  try {
    // Validate Supabase CLI is installed
    await validateSupabaseCli();
    const { stdout, stderr } = await execa(
      'supabase',
      ['link', '--project-ref', projectRef],
      {
        cwd: configDir, // Use the updated config directory path
        shell: true,
      }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('Project linked successfully.');
  } catch (error) {
    console.error('Error linking project:', error);
    throw new SupabaseMigrationError('Failed to link project', error);
  }
}

/**
 * Pulls the database schema from a remote Supabase project
 */
/**
 * Pulls the database schema from a remote Supabase project
 *
 * This function pulls the current database schema from a linked remote Supabase project.
 * The project must be linked first using the linkProject function.
 *
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not installed
 * @throws {SupabaseMigrationError} If there's an error pulling the schema
 * @returns {Promise<void>} A promise that resolves when the schema is pulled
 * @example
 * // Pull the database schema from a linked Supabase project
 * await pullSchema();
 */
export async function pullSchema() {
  console.log('Pulling database schema from Supabase...');
  try {
    // Validate Supabase CLI is installed
    await validateSupabaseCli();
    const { stdout, stderr } = await execa(
      'supabase',
      ['db', 'pull'],
      {
        cwd: configDir, // Use the updated config directory path
        shell: true,
      }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('Schema pulled successfully.');
  } catch (error) {
    console.error('Error pulling schema:', error);
    throw new SupabaseMigrationError('Failed to pull schema', error);
  }
}

/**
 * Lists all migrations and their status
 * @returns An array of Migration objects with status information
 */
/**
 * Lists all migrations and their status
 *
 * This function retrieves a list of all migrations in the db/migrations directory
 * and their current status (applied or pending). It parses the output of the
 * Supabase CLI to extract migration information.
 *
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not installed
 * @throws {SupabaseMigrationError} If there's an error listing migrations
 * @returns {Promise<Migration[]>} A promise that resolves to an array of Migration objects
 * @example
 * // Get all migrations and their status
 * const migrations = await listMigrations();
 * migrations.forEach(m => {
 *   console.log(`${m.name}: ${m.status}`);
 * });
 */
export async function listMigrations(): Promise<Migration[]> {
  console.log('Listing migrations...');
  try {
    // Validate Supabase CLI is installed
    await validateSupabaseCli();
    const { stdout, stderr } = await execa(
      'supabase',
      ['migration', 'list'],
      {
        cwd: configDir, // Use the updated config directory path
        shell: true,
      }
    );
    
    if (stderr) console.error(stderr);
    if (stdout) {
      console.log(stdout);
      // Parse the output to extract migration status information
      return parseMigrationListOutput(stdout);
    }
    
    return [];
  } catch (error) {
    console.error('Error listing migrations:', error);
    throw new SupabaseMigrationError('Failed to list migrations', error);
  }
}

/**
 * Gets the status of all migrations
 * @returns An object with applied and pending migrations
 */
/**
 * Gets the status of all migrations
 *
 * This function retrieves all migrations and categorizes them as either applied
 * or pending. It's a convenience wrapper around listMigrations that separates
 * the migrations by their status.
 *
 * @throws {SupabaseMigrationError} If there's an error getting migration status
 * @returns {Promise<{applied: Migration[], pending: Migration[]}>} Object containing applied and pending migrations
 * @example
 * // Get migration status
 * const status = await getMigrationStatus();
 * console.log(`Applied: ${status.applied.length}, Pending: ${status.pending.length}`);
 */
export async function getMigrationStatus(): Promise<{ applied: Migration[], pending: Migration[] }> {
  try {
    const migrations = await listMigrations();
    
    return {
      applied: migrations.filter(m => m.status === MigrationStatus.APPLIED),
      pending: migrations.filter(m => m.status === MigrationStatus.PENDING)
    };
  } catch (error) {
    console.error('Error getting migration status:', error);
    throw new SupabaseMigrationError('Failed to get migration status', error);
  }
}

/**
 * Reverts a specific migration by name
 * @param name The name of the migration to revert
 */
/**
 * Reverts a specific migration by name
 *
 * This function reverts a specific migration by its name. It first checks if the
 * migration exists and is applied, then extracts the version from the migration name
 * and uses it to revert the migration.
 *
 * @param {string} name - The name of the migration to revert
 * @throws {SupabaseCliNotFoundError} If the Supabase CLI is not installed
 * @throws {MigrationReversionError} If the migration is not found or cannot be reverted
 * @returns {Promise<void>} A promise that resolves when the migration is reverted
 * @example
 * // Revert a specific migration
 * await revertMigration('create_users_table');
 */
export async function revertMigration(name: string): Promise<void> {
  console.log(`Reverting migration: ${name}...`);
  try {
    // Validate Supabase CLI is installed
    await validateSupabaseCli();
    
    // Check if the migration exists and is applied
    const migrations = await listMigrations();
    const migration = migrations.find(m => m.name.includes(name) && m.status === MigrationStatus.APPLIED);
    
    if (!migration) {
      throw new MigrationReversionError(`Migration '${name}' not found or not applied`);
    }
    
    // Extract the version from the migration name (timestamp part before the first underscore)
    const versionMatch = migration.name.match(/^(\d+T\d+)_/);
    if (!versionMatch || !versionMatch[1]) {
      throw new MigrationReversionError(`Could not extract version from migration name: ${migration.name}`);
    }
    
    const version = versionMatch[1];
    
    // Execute the reversion
    const { stdout, stderr } = await execa(
      'supabase',
      ['migration', 'down', '--target-version', version],
      {
        cwd: configDir,
        shell: true,
      }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`Migration '${name}' reverted successfully.`);
  } catch (error) {
    console.error('Error reverting migration:', error);
    throw new MigrationReversionError(`Failed to revert migration '${name}'`, error);
  }
}

/**
 * Reverts the most recently applied migration
 */
/**
 * Reverts the most recently applied migration
 *
 * This function finds the most recently applied migration and reverts it.
 * It sorts migrations by their appliedAt date (if available) or by name
 * (which includes a timestamp) to determine the most recent one.
 *
 * @throws {MigrationReversionError} If there are no applied migrations or the reversion fails
 * @returns {Promise<void>} A promise that resolves when the migration is reverted
 * @example
 * // Revert the most recently applied migration
 * await revertLastMigration();
 */
export async function revertLastMigration(): Promise<void> {
  console.log('Reverting last migration...');
  try {
    // Get all applied migrations
    const { applied } = await getMigrationStatus();
    
    if (applied.length === 0) {
      throw new MigrationReversionError('No applied migrations to revert');
    }
    
    // Sort by appliedAt date (if available) or by name (which includes timestamp)
    const sortedMigrations = [...applied].sort((a, b) => {
      if (a.appliedAt && b.appliedAt) {
        return b.appliedAt.getTime() - a.appliedAt.getTime();
      }
      return b.name.localeCompare(a.name);
    });
    
    // Get the most recent migration
    const lastMigration = sortedMigrations[0];
    
    if (!lastMigration) {
      throw new MigrationReversionError('No applied migrations found to revert');
    }
    
    // Revert it
    await revertMigration(lastMigration.name);
    
    console.log('Last migration reverted successfully.');
  } catch (error) {
    console.error('Error reverting last migration:', error);
    throw new MigrationReversionError('Failed to revert last migration', error);
  }
}

/**
 * Ensures the migrations directory exists
 */
async function ensureMigrationsDir() {
  try {
    await fs.mkdir(migrationsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating migrations directory:', error);
    throw new SupabaseMigrationError('Failed to ensure migrations directory exists', error);
  }
}

/**
 * Ensures the seed file exists
 */
async function ensureSeedFile() {
  try {
    try {
      await fs.access(seedFilePath);
    } catch {
      // Create seeds directory if it doesn't exist
      const seedsDir = path.dirname(seedFilePath);
      await fs.mkdir(seedsDir, { recursive: true });
      
      // Create seed file if it doesn't exist
      await fs.writeFile(
        seedFilePath,
        `-- Seed file for Supabase database\n-- Created at: ${new Date().toISOString()}\n\n-- Write your seed data here\n`
      );
      console.log(`Created seed file at: ${seedFilePath}`);
    }
  } catch (error) {
    console.error('Error ensuring seed file exists:', error);
    throw new SupabaseMigrationError('Failed to ensure seed file exists', error);
  }
}

/**
 * Parses the output of the 'supabase migration list' command to extract migration information
 * @param output The stdout from the migration list command
 * @returns An array of Migration objects
 */
function parseMigrationListOutput(output: string): Migration[] {
  const migrations: Migration[] = [];
  const lines = output.split('\n');
  
  // Skip header lines and process each migration line
  for (const line of lines) {
    // Example line format: "✓ 20250507T195222_create_users_table.sql"
    // or "✗ 20250507T195222_create_users_table.sql"
    const match = line.trim().match(/^(✓|✗)\s+([^\s]+)$/);
    
    if (match && match[1] && match[2]) {
      const status = match[1] === '✓' ? MigrationStatus.APPLIED : MigrationStatus.PENDING;
      const fileName = match[2];
      
      // Extract name without extension
      const name = path.basename(fileName, '.sql');
      
      // Create migration object
      const migration: Migration = {
        name,
        path: path.join(migrationsDir, fileName),
        status,
      };
      
      // If applied, try to extract timestamp from name and convert to Date
      if (status === MigrationStatus.APPLIED) {
        const timestampMatch = name.match(/^(\d{8}T\d{6})_/);
        if (timestampMatch && timestampMatch[1]) {
          const timestamp = timestampMatch[1];
          // Format: YYYYMMDDTHHMMSS
          try {
            const year = timestamp.substring(0, 4);
            const month = timestamp.substring(4, 6);
            const day = timestamp.substring(6, 8);
            const hour = timestamp.substring(9, 11);
            const minute = timestamp.substring(11, 13);
            const second = timestamp.substring(13, 15);
            
            migration.appliedAt = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          } catch (error) {
            console.warn(`Could not parse timestamp from migration name: ${name}`);
          }
        }
      }
      
      migrations.push(migration);
    }
  }
  
  return migrations;
}
