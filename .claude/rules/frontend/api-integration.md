---
paths:
  - "src/app/api/**"
  - "src/lib/api*"
  - "src/hooks/use*Query*"
  - "src/hooks/use*Mutation*"
---

# API Integration Rules

## Proxy Pattern

- ALL backend calls go through `src/app/api/` Route Handlers
- Never expose backend URL in client-side code
- Route Handlers read JWT from HttpOnly cookies and forward as Bearer token
- Handle token refresh transparently (401 → refresh → retry)

## API Client (`src/lib/api.ts`)

- Single fetch wrapper for all client-side API calls
- Always use relative URLs (`/api/...`) — proxied through Next.js
- Include `credentials: 'include'` for cookie handling
- Throw typed errors with status code and message

## Error Handling

- Route Handlers return consistent error format: `{ error: string, status: number }`
- Client-side: catch errors in TanStack Query's `onError`
- Show user-friendly toast/message — never raw error details
- Log detailed errors server-side only (Route Handler console)

## Loading States

- Every data-fetching component has a loading state
- Use `loading.tsx` for route-level loading
- Use TanStack Query's `isLoading`/`isPending` for component-level
