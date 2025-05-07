# @repo/supabase

This package provides shared functionality for integrating with Supabase, including database migrations, seeding, authentication, and storage.

## Migration System

The Supabase migration system provides a robust way to manage database schema changes and data seeding. It includes both a programmatic API for use in applications and CLI commands for development workflows.

### Overview

The migration system consists of:

1. **Core Migration Functions**: A set of TypeScript functions in `src/migration.ts` for managing migrations programmatically
2. **NestJS Integration**: A module and service for integrating migrations with NestJS applications
3. **CLI Scripts**: Utility scripts for running migrations and seeds from the command line

### Prerequisites

- Ensure you have the Supabase CLI installed and configured locally.
- Set the `DATABASE_URL` environment variable in your `.env` file for seeding operations.

### Available Functions

The migration system provides the following core functions:

| Function                      | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `validateSupabaseCli()`       | Validates that the Supabase CLI is installed and accessible |
| `runMigrations()`             | Runs all pending Supabase migrations                        |
| `seedDatabase(reset = false)` | Seeds the database with initial data, with optional reset   |
| `createMigration(name)`       | Creates a new migration file with the given name            |
| `listMigrations()`            | Lists all migrations and their status                       |
| `getMigrationStatus()`        | Gets the status of all migrations (applied and pending)     |
| `revertMigration(name)`       | Reverts a specific migration by name                        |
| `revertLastMigration()`       | Reverts the most recently applied migration                 |
| `linkProject(projectRef)`     | Links the local Supabase project to a remote project        |
| `pullSchema()`                | Pulls the database schema from a remote Supabase project    |

### NestJS Integration

The migration system integrates with NestJS through the `MigrationModule` and `MigrationService`.

#### MigrationModule

The `MigrationModule` provides a way to configure migration options and inject the `MigrationService`:

```typescript
// Import in your app module
import { MigrationModule } from './supabase/migration.module';

@Module({
  imports: [
    MigrationModule.forRoot({
      autoRunMigrations: true,
      autoSeedDatabase: false,
      resetDatabaseOnSeed: false,
    }),
  ],
})
export class AppModule {}
```

#### MigrationService

The `MigrationService` wraps the migration functionality and provides methods for running migrations, checking status, and reverting migrations:

```typescript
// Inject in your service or controller
@Injectable()
export class YourService {
  constructor(private readonly migrationService: MigrationService) {}

  async someMethod() {
    // Run migrations
    await this.migrationService.runMigrations();

    // Get migration status
    const status = await this.migrationService.getMigrationStatus();
    console.log(`Applied: ${status.applied.length}, Pending: ${status.pending.length}`);
  }
}
```

#### Configuration Options

The `MigrationModule` accepts the following configuration options:

| Option                | Type    | Default | Description                                                          |
| --------------------- | ------- | ------- | -------------------------------------------------------------------- |
| `autoRunMigrations`   | boolean | false   | Whether to run migrations automatically during application startup   |
| `autoSeedDatabase`    | boolean | false   | Whether to seed the database during application startup              |
| `resetDatabaseOnSeed` | boolean | false   | Whether to reset the database before seeding (destructive operation) |

#### Environment Variables

The migration system uses the following environment variables:

| Variable                 | Required          | Description                                                      |
| ------------------------ | ----------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`           | Yes (for seeding) | The connection URL for the Supabase database                     |
| `AUTO_RUN_MIGRATIONS`    | No                | Set to 'true' to automatically run migrations on startup         |
| `AUTO_SEED_DATABASE`     | No                | Set to 'true' to automatically seed the database on startup      |
| `RESET_DATABASE_ON_SEED` | No                | Set to 'true' to reset the database before seeding (destructive) |
| `SUPABASE_URL`           | Yes (for auth)    | The URL of your Supabase project                                 |
| `SUPABASE_KEY`           | Yes (for auth)    | The API key for your Supabase project                            |

## Database Workflows

This package includes scripts and npm commands to manage your Supabase database schema and data.

### Running Migrations

To apply any pending database migrations, use the following command:

```bash
pnpm run migrate:up
```

This will run the `scripts/migrations/run-migrations.js` which executes `supabase migration up` in the correct directory.

### Seeding the Database

To seed the database with initial data from `db/seeds/seed.sql`, use the following command:

```bash
pnpm run db:seed
```

This will run the `scripts/migrations/run-migrations.js` with the `--seed` flag.

To reset the database and then seed it (this is a destructive operation and will delete all data), use:

```bash
pnpm run db:seed:reset
```

This will run the `scripts/migrations/run-migrations.js` with the `--seed` and `--reset` flags.

### Creating New Migrations

To create a new migration file, use the following command:

```bash
pnpm run migrate:create <migration-name>
```

Replace `<migration-name>` with a descriptive name for your migration (e.g., `add_users_table`). This will create a new SQL file in the `db/migrations` directory with a timestamp prefix.

### Viewing Database State

To view the list of all tables in your database, use:

```bash
pnpm run db:view
```

To view the structure and contents of specific tables, provide the table names as arguments:

```bash
pnpm run db:view users products
```

This will run the `scripts/utils/view-database.js` script.

### Best Practices for Database Changes

- Always create a new migration file for any schema changes.
- Use descriptive names for your migration files.
- Write your SQL migrations to be idempotent where possible.
- Test your migrations and seeds locally before applying them to staging or production environments.
- Be cautious when using `db:seed:reset` as it will delete all data.
