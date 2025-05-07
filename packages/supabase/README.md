# @repo/supabase

This package provides shared functionality for integrating with Supabase, including database migrations, seeding, authentication, and storage.

## Database Workflows

This package includes scripts and npm commands to manage your Supabase database schema and data.

### Prerequisites

- Ensure you have the Supabase CLI installed and configured locally.
- Set the `DATABASE_URL` environment variable in your `.env` file for seeding operations.

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
