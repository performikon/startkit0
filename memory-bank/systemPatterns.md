# System Patterns

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-05-07 14:28:55 - Log of updates made.

-

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

## Testing Patterns

- Jest for unit and integration tests
- End-to-end tests with Jest and Supertest
- Test coverage tracking
