#!/usr/bin/env node

import { createMigration } from '@repo/supabase';

async function main() {
  const args = process.argv.slice(2);
  const migrationName = args[0];

  if (!migrationName) {
    console.error('Please provide a name for the migration.');
    process.exit(1);
  }

  try {
    await createMigration(migrationName);
    console.log(`Migration "${migrationName}" created successfully.`);
  } catch (error) {
    console.error(`Error creating migration "${migrationName}":`, error);
    process.exit(1);
  }
}

main();
