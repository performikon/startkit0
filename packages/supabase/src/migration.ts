// packages/supabase/src/migration.ts

import execa from 'execa';
import path from 'path';

const supabaseDir = path.resolve(__dirname, '../'); // Path to the supabase directory

export async function runMigrations() {
  console.log('Running Supabase migrations...');
  try {
    // This command assumes you have the Supabase CLI installed and configured
    // It will apply pending migrations in the supabase/migrations directory
    const { stdout, stderr } = await execa(
      'npx',
      ['supabase', 'migrate', 'up'],
      {
        cwd: supabaseDir,
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
    throw error;
  }
}

export async function seedDatabase() {
  console.log('Seeding Supabase database...');
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  try {
    // This command assumes you have a seed.sql file in the supabase directory
    const { stdout, stderr } = await execa(
      'npx',
      [
        'supabase',
        'db',
        'reset',
        '--no-verify',
        '--skip-migrations',
        '--db-url',
        process.env.DATABASE_URL,
      ],
      {
        cwd: supabaseDir,
        env: {
          ...process.env,
          // Ensure DATABASE_URL is available in the environment
          DATABASE_URL: process.env.DATABASE_URL,
        },
      }
    );
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    console.log('Supabase database seeding finished.');
  } catch (error) {
    console.error('Error seeding Supabase database:', error);
    throw error;
  }
}

// You might also want functions for:
// - Generating new migrations: supabase migrate new <migration-name>
// - Linking to a Supabase project: supabase link --project-ref <project-id>
// - Pulling schema: supabase db pull
