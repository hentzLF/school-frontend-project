# Coding Style

## Core Principles

- **KISS** — Simplest solution that works
- **DRY** — Extract repeated logic into shared functions/hooks
- **YAGNI** — Don't build features before they're needed

## File Organization

- 200 lines typical, 400 max for components
- Organize by feature/domain, not by type
- Co-locate tests next to source files

## Error Handling

- Handle errors explicitly at every level
- User-friendly error messages in UI
- Never silently swallow errors
- Use error.tsx boundaries for route-level errors
