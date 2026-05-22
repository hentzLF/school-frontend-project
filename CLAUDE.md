# AgriMarket Frontend — React/Next.js

Separate client app for the AgriMarket agricultural service marketplace.
Consumes the AgriMarket REST API (ASP.NET Core backend) via JWT authentication.
TalTech HTIITS course final project.

## Quick Reference

```bash
npm run dev                     # Start dev server (port 3000)
npm run build                   # Production build
npm run lint                    # ESLint check
npm run format                  # Prettier formatting
npm run test                    # Vitest unit tests
npm run test -- --coverage      # Unit tests with coverage report
```

## Architecture

- **Next.js 16+** with App Router (React Server Components by default)
- All backend calls proxied through `app/api/` Route Handlers — never expose backend URL to client
- JWT stored in HttpOnly cookies — never localStorage
- Auth flow managed server-side via proxy pattern (no CORS issues)

```
src/
├── app/                    # Routes, layouts, pages (App Router)
│   ├── (auth)/             # Login, register
│   ├── (dashboard)/        # Protected pages
│   ├── admin/              # Admin area
│   └── api/                # Route Handlers (proxy to backend)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Footer, Sidebar, Navigation
│   └── forms/              # Form components
├── hooks/                  # Custom React hooks
├── lib/                    # API client, auth utilities, helpers
├── stores/                 # Zustand stores
├── types/                  # TypeScript type definitions
└── config/                 # App configuration constants
```

## Tech Stack

- Next.js 16+, React 19, TypeScript (strict mode)
- Tailwind CSS v4 (basic Tailwind first — shadcn/ui added in final UI polish phase)
- TanStack Query (server state), Zustand (client state)
- React Hook Form + Zod (forms + validation)
- Vitest + React Testing Library (unit tests)
- Docker + GitLab CI/CD

## Implementation Order

Build functionality first, polish UI last:

1. Scaffold + folder structure
2. Auth flow (working, minimal UI)
3. Client area features (working, basic Tailwind)
4. Admin area (functional CRUD)
5. i18n (en, et)
6. Testing
7. UI/UX polish — ONLY THEN install shadcn/ui, redesign with design system

## Backend Integration

- Backend API: AgriMarket ASP.NET Core (separate repo: htiits-csharp-modular)
- Auth: JWT Bearer + refresh tokens via HttpOnly cookies
- API proxy: `src/app/api/` Route Handlers forward requests to backend
- CORS: avoided entirely via proxy pattern (browser only talks to Next.js)

## Conventions

### Code Style

- TypeScript strict mode — no `any` types
- Named exports only (no default exports)
- Components under 200 lines — extract sub-components
- Extract complex logic to custom hooks in `src/hooks/`
- `type` over `interface` for object shapes
- No CSS-in-JS — Tailwind only
- No console.log in committed code
- Run `npm run lint && npm run format` before committing

### Components

- Server Components by default — add `"use client"` only when needed
- Keep `"use client"` boundaries as low in the tree as possible
- Use `loading.tsx` for suspense, `error.tsx` for error boundaries
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`

### Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Subject lines < 72 chars, English, imperative mood
- Run `npm run build` before committing
- One logical change per commit

### Testing

- Minimum 80% coverage
- Unit tests: Vitest + React Testing Library
- Naming: `describe('ComponentName', () => it('should do X when Y'))`

## What NOT to Do

- Do NOT call backend API directly from client components — use Route Handlers
- Do NOT store JWT in localStorage or sessionStorage
- Do NOT use `any` type — define proper types
- Do NOT use default exports
- Do NOT use `useEffect` for data fetching — fetch in Server Components
- Do NOT skip `npm run build` verification before commits
