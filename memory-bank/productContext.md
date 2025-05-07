# Product Context

This file provides a high-level overview of the project and the expected product that will be created.
This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.

## Project Goal

- StartKit is a modern, scalable platform providing core business functionality through well-defined microservices
- The platform delivers essential capabilities for user management, authentication, subscription handling, and account management
- Following a phase-based implementation approach with clear scope boundaries for each phase
- Building a foundation that supports incremental development without over-engineering

## Key Features

### Phase 1 (Current)

- Set up the Core app
- Set up the Supabase package and client interfaces for auth, db, storage
- Set up Supabase initialization and migrations/seed
- Set up logging and monitoring
- Set up testing frameworks and infrastructure
- Set up Docker and environment variables for development and production
- Update documentation site with essential guides

### Future Phases

- Web Client (Next.js) - Frontend application for user interaction
- Tools Service (Python) - For LLM interactions
- Enhanced authentication, subscription management, and billing
- Admin dashboard and analytics

## Overall Architecture

- Monorepo structure using Turborepo for orchestration
- TypeScript used throughout the codebase
- Core backend service built with NestJS
- Frontend applications using Next.js
- Shared packages for UI components, ESLint configurations, and TypeScript configurations
- Python service planned for LLM integration

## Development Approach

- Start small, iterate often with a focus on incremental development
- Prefer simplicity over complexity when implementing features
- Maintain strict service boundaries and well-defined interfaces
- Feature sizing rule: each feature should be implementable in 1-2 days
- Regular review process to prevent scope expansion and feature creep
