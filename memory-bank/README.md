# Memory Bank

## Purpose

The Memory Bank is a structured documentation system that maintains project context across sessions. It consists of several specialized files, each with a specific purpose and update format.

## Files

- **productContext.md**: High-level product vision, goals, and features
- **activeContext.md**: Current status, challenges, and open questions
- **systemPatterns.md**: Technical patterns and architectural details
- **progress.md**: Task management with Todo/Doing/Done sections
- **decisionLog.md**: Chronological log of architectural decisions

## Update Guidelines

1. **Always include timestamps** in the format `[YYYY-MM-DD HH:MM:SS]` at the beginning of each log entry
2. **Update the appropriate file** based on the type of information:
   - Product vision changes → productContext.md
   - Current work status → activeContext.md
   - Technical patterns → systemPatterns.md
   - Task status changes → progress.md
   - Architectural decisions → decisionLog.md
3. **Avoid duplication** between files
4. **Preserve chronological order** in logs
5. **Follow consistent formatting** using Markdown conventions

## Timestamp Format

All timestamps must follow the format: `[YYYY-MM-DD HH:MM:SS]`

Example: `[2025-05-08 13:00:00] - Added new feature X`
