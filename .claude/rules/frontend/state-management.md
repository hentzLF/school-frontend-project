---
paths:
  - "src/stores/**"
  - "src/hooks/**"
  - "src/**/*.{ts,tsx}"
---
# State Management Rules

## When to Use What

| State Type | Tool | Example |
|-----------|------|---------|
| Server data (API responses) | TanStack Query | Listings, bookings, user profile |
| Client UI state | Zustand | Sidebar open, theme, modal visibility |
| Form state | React Hook Form | Login form, booking form |
| URL state | Next.js searchParams | Filters, pagination, sorting |
| Auth state | HttpOnly cookies + Route Handlers | JWT tokens |

## TanStack Query

- Use unique query keys: `['listings', listingId]`
- Invalidate queries after mutations: `queryClient.invalidateQueries`
- Set appropriate `staleTime` — don't refetch on every render
- Use `useMutation` for POST/PUT/DELETE operations

## Zustand

- Keep stores small and focused (one per domain)
- Store in `src/stores/` with descriptive names
- No API calls in stores — use TanStack Query for that
- Use `persist` middleware only for truly persistent state (theme, language)
