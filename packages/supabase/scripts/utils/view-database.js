import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * View database contents
 * @param {string[]} tables - The tables to view (optional)
 */
async function viewDatabase(tables) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set.');
      console.error('Please set it in your .env file and try again.');
      process.exit(1);
    }

    console.log(`Connecting to database: ${process.env.DATABASE_URL}`);

    if (tables && tables.length > 0) {
      // View each specified table
      for (const table of tables) {
        console.log(`\n=== Viewing contents of table: ${table} ===`);

        // First show the table structure
        console.log('\nTable structure:');
        try {
          const tableStructure = execSync(`psql ${process.env.DATABASE_URL} -c "\\d ${table}"`, {
            encoding: 'utf-8',
          });
          console.log(tableStructure);
        } catch (error) {
          console.error(`Error getting structure for table ${table}:`, error.message);
        }

        // Then show the table contents
        console.log('\nTable contents:');
        try {
          const tableContents = execSync(
            `psql ${process.env.DATABASE_URL} -c "SELECT * FROM ${table}"`,
            { encoding: 'utf-8' },
          );
          console.log(tableContents);
        } catch (error) {
          console.error(`Error getting contents for table ${table}:`, error.message);
        }

        console.log(`\n=== End of table: ${table} ===`);
      }
    } else {
      console.log('Listing all tables:');
      // List all tables
      const tables = execSync(`psql ${process.env.DATABASE_URL} -c "\\dt"`, { encoding: 'utf-8' });
      console.log(tables);

      // List all schemas
      console.log('\nAvailable schemas:');
      const schemas = execSync(
        `psql ${process.env.DATABASE_URL} -c "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name"`,
        { encoding: 'utf-8' },
      );
      console.log(schemas);
    }
  } catch (error) {
    console.error('Error viewing database:', error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

// Run the function with all arguments as table names
viewDatabase(args);
