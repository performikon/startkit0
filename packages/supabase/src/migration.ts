// packages/supabase/src/migration.ts

import execa from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MissingEnvironmentVariableError, SupabaseMigrationError } from './errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseDir = path.resolve(__dirname, '../'); // Path to the supabase directory
const migrationsDir = path.resolve(supabaseDir, 'db/migrations');
const seedFilePath = path.resolve(supabaseDir, 'db/seeds/seed.sql');
const configDir = path.resolve(supabaseDir, 'db'); // Updated path to the config directory

/**
 * Runs all pending Supabase migrations
 */
export async function runMigrations() {
  console.log('Running Supabase migrations...');
  try {
    // Ensure migrations directory exists
    await ensureMigrationsDir();
    
    // This command assumes you have the Supabase CLI installed and configured
    // It will apply pending migrations in the db/migrations directory
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
export async function linkProject(projectRef: string) {
  console.log(`Linking to Supabase project: ${projectRef}`);
  try {
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
export async function pullSchema() {
  console.log('Pulling database schema from Supabase...');
  try {
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
 */
export async function listMigrations() {
  console.log('Listing migrations...');
  try {
    const { stdout, stderr } = await execa(
      'supabase',
      ['migration', 'list'],
      {
        cwd: configDir, // Use the updated config directory path
        shell: true,
      }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('Error listing migrations:', error);
    throw new SupabaseMigrationError('Failed to list migrations', error);
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
