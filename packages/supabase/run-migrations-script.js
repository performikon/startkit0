import { runMigrations, seedDatabase } from '@repo/supabase';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Main function to run migrations and optionally seed the database
 * @param {Object} options - Script options
 * @param {boolean} options.seed - Whether to seed the database after migrations
 * @param {boolean} options.reset - Whether to reset the database before seeding (destructive)
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = {
      seed: args.includes('--seed'),
      reset: args.includes('--reset'),
    };

    // Run migrations
    console.log('Starting database migrations...');
    await runMigrations();
    console.log('Migrations completed successfully.');

    // Seed database if requested
    if (options.seed) {
      try {
        console.log('Starting database seeding...');

        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
          console.warn('DATABASE_URL environment variable is not set. Skipping database seeding.');
          console.warn(
            'To seed the database, set the DATABASE_URL environment variable and run this script again.',
          );
        } else {
          await seedDatabase(options.reset);
          console.log('Database seeding completed successfully.');
        }
      } catch (error) {
        console.error('Error seeding database:', error);
        console.warn('Migration completed but seeding failed.');
      }
    }

    console.log('Migration script finished successfully.');
  } catch (error) {
    console.error('Migration script failed:', error);
    process.exit(1);
  }
}

main();
