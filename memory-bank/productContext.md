# Product Context

## Purpose

This file provides a high-level overview of the project's vision, goals, and features. It should be updated when significant changes occur to the product direction or scope.

## Update Format

Updates should be timestamped and appended as footnotes:
`[YYYY-MM-DD HH:MM:SS] - [Summary of Change]`

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

## Change History

[2025-05-07 14:46:01] - Added phase-based implementation approach with feature sizing guidelines
