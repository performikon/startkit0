# @repo/config

A shared configuration package for managing environment-specific settings across the application.

## Features

- Environment-specific configuration loading
- Type-safe configuration with validation
- Support for local development, staging, and production environments
- Centralized Supabase configuration management

## Installation

This package is part of the monorepo and is available as `@repo/config`.

```bash
# From another package or app in the monorepo
npm install @repo/config
```

## Usage

### Getting Supabase Configuration

```typescript
import { getSupabaseConfig } from '@repo/config';

// Get the Supabase configuration for the current environment
const supabaseConfig = getSupabaseConfig();

console.log(supabaseConfig.url); // Supabase URL
console.log(supabaseConfig.apiKey); // Supabase API key
console.log(supabaseConfig.environment); // Current environment (development, staging, production)
```

### Using the Configuration Provider

```typescript
import { getConfigProvider } from '@repo/config';

// Get the configuration provider
const configProvider = getConfigProvider();

// Get Supabase configuration
const supabaseConfig = configProvider.getSupabaseConfig();
```

### Environment Variables

The package loads environment variables from the following files (in order of precedence):

1. `.env.{environment}.local` (highest precedence, not committed to version control)
2. `.env.local` (not committed to version control)
3. `.env.{environment}` (committed to version control, environment-specific defaults)
4. `.env` (committed to version control, defaults for all environments)

Where `{environment}` is one of:

- `development` (default when NODE_ENV is not set)
- `staging`
- `production`
- `test` (used during test runs)

## Required Environment Variables

For Supabase configuration, the following environment variables are required:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-api-key
```

Optional environment variables:

```
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_STORAGE_BUCKET=your-storage-bucket
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/postgres
```

## Example .env Files

See the example .env files in the project root:

- `.env.development` - Development environment defaults
- `.env.staging` - Staging environment defaults

## License

Internal use only
