# Supabase Package

This package provides utilities for working with Supabase in your project.

## Database Migrations

The migration system allows you to manage your Supabase database schema in a version-controlled way.

### Directory Structure

```
packages/supabase/
├── supabase/
│   ├── migrations/       # SQL migration files
│   │   └── 20250507185213_initial_schema.sql
│   └── seed.sql          # Seed data for development
├── src/                  # TypeScript source files
├── dist/                 # Compiled JavaScript files
├── run-migrations-script.js  # Script to run migrations
└── view-database.js      # Script to view database contents
```

### Running Migrations

To apply all pending migrations:

```bash
node packages/supabase/run-migrations-script.js
```

To apply migrations and seed the database:

```bash
node packages/supabase/run-migrations-script.js --seed
```

### Viewing Database Contents

To list all tables in the database:

```bash
node packages/supabase/view-database.js
```

To view the contents of a specific table:

```bash
node packages/supabase/view-database.js public.profiles
```

## Environment Variables

The following environment variables are used:

- `DATABASE_URL`: Connection string for the Supabase PostgreSQL database
  - Default: `postgresql://postgres:postgres@localhost:54322/postgres`

These can be set in a `.env` file at the root of your project.

## Creating New Migrations

To create a new migration file:

1. Create a new SQL file in the `supabase/migrations` directory
2. Name it with a timestamp prefix, e.g., `20250508000000_add_products_table.sql`
3. Write your SQL migration code
4. Run the migrations script to apply it

Example migration file:

```sql
-- Migration: Add products table
-- Created at: 2025-05-08T00:00:00.000Z

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger to products table
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

## Seeding Data

The seed file (`supabase/seed.sql`) is used to populate the database with initial data for development and testing.

Note that when seeding user profiles, you should be aware of the foreign key constraint to the `auth.users` table. In a real application, you would:

1. Create users through the Supabase Auth API
2. Let the trigger function create the profiles automatically
3. Update the profiles with additional data if needed
