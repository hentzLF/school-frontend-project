# AgriMarket Frontend

A separate client application for the **AgriMarket** agricultural service
marketplace. It consumes the AgriMarket REST API (an ASP.NET Core backend)
through JWT authentication.

TalTech HTIITS course final project.

## Tech Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **TanStack Query** (server state) + **Zustand** (client state)
- **React Hook Form** + **Zod** (forms and validation)
- **Vitest** + **React Testing Library** (unit tests)
- **Docker** + **GitLab CI/CD**

## Architecture

- All backend calls are proxied through `src/app/api/` Route Handlers — the
  backend URL is never exposed to client-side code, which also avoids CORS
  entirely (the browser only ever talks to Next.js).
- JWT access and refresh tokens are stored in **HttpOnly cookies**, never in
  `localStorage`/`sessionStorage`.
- Route Handlers read the JWT from the cookie and forward it as a Bearer token.

```
src/
├── app/                # Routes, layouts, pages (App Router)
│   ├── (auth)/         # Login, register
│   ├── (dashboard)/    # Protected client area
│   ├── admin/          # Admin area (Admin role required)
│   └── api/            # Route Handlers (proxy to backend)
├── components/         # ui/, layout/, forms/, feature components
├── hooks/              # Custom React hooks
├── lib/                # API client, auth utilities, helpers
├── stores/             # Zustand stores (theme, locale)
├── types/              # TypeScript type definitions
├── i18n/               # Translations (en, et)
└── config/             # App configuration constants
```

## Getting Started

### Prerequisites

- Node.js 22+
- A running instance of the AgriMarket ASP.NET Core backend

### Setup

```bash
npm install
cp .env.local.example .env.local   # then edit BACKEND_URL if needed
npm run dev                        # http://localhost:3000
```

### Environment Variables

| Variable      | Description                                          |
| ------------- | ---------------------------------------------------- |
| `BACKEND_URL` | Base URL of the AgriMarket backend API (server-side) |

See [`.env.local.example`](./.env.local.example) for details.

## Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint check
npm run format   # Prettier formatting
npm run test     # Vitest unit tests
```

## Internationalisation

The UI ships with English (`en`) and Estonian (`et`) translations. The active
locale is held in a persisted Zustand store and switched via the header's
locale switcher.

## Docker

```bash
docker compose up --build
```

The multi-stage `Dockerfile` produces a minimal standalone runtime image that
runs as a non-root user. `docker-compose.yml` exposes the app on port 3000 and
passes `BACKEND_URL` at runtime.

## CI/CD

`.gitlab-ci.yml` defines three stages:

1. **verify** — `npm ci`, `npm run lint`, `npm run test`
2. **build** — build and push the Docker image to the registry
3. **deploy** — roll out the latest image (manual trigger)

## Project Conventions

- TypeScript strict mode — no `any`
- Named exports only (Next.js `page.tsx`/`layout.tsx` files excepted — the
  framework requires default exports there)
- Server Components by default; `"use client"` only where needed
- Conventional commit messages
- Run `npm run lint`, `npm run build` before committing
