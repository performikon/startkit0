# System Patterns

## Purpose

This file documents recurring patterns, standards, and architectural decisions used in the project. It serves as a central reference for technical implementation details.

## Update Format

Updates should be timestamped and appended to the relevant section:
`[YYYY-MM-DD HH:MM:SS] - [Description of Pattern/Change]`

## Coding Patterns

- TypeScript used throughout the codebase for static typing
- Shared configuration packages for consistent tooling
- ESLint and Prettier for code quality and formatting
- Jest for testing across applications

## Architectural Patterns

- Monorepo structure with Turborepo for project organization
- Microservices/micro-frontend approach with separate deployable applications
- Apps will use a DDD pattern for business logic and domain models
- NestJS for backend service (modular architecture)
- React for frontend applications
- Shared packages for cross-application code reuse
- Supabase for database, authentication, RLS, and storage
- Docker for containerization
- Centralized environment configuration management using a shared `packages/config` package.

## Testing Patterns

- Jest for unit and integration tests
- End-to-end tests with Jest and Supertest
- Test coverage tracking

## Change History

[2025-05-08 13:01:00] - Standardized documentation format and consolidated architectural patterns
