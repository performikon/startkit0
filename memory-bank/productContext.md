# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-05-07 14:28:05 - Log of updates made will be appended as footnotes to the end of this file.
2025-05-07 14:45:42 - Updated based on newly created projectBrief.md content.

-

## Project Goal

- StartKit is a modern, scalable platform providing core business functionality through well-defined microservices
- The platform delivers essential capabilities for user management, authentication, subscription handling, and account management
- Following a phase-based implementation approach with clear scope boundaries for each phase
- Building a foundation that supports incremental development without over-engineering

## Key Features

### Phase 1 (Current)

- Core API Service (NestJS) with:
  - Basic user authentication (email/password)
  - Simple user profile management
  - Basic account creation and management
  - Fundamental subscription capabilities
- Documentation site with essential guides
- Shared component library foundation

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
