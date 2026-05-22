---
paths:
  - "src/app/**/*.{ts,tsx}"
---

# Next.js App Router Rules

- Components are Server Components by default
- Add `"use client"` ONLY for useState, useEffect, useRef, or browser event handlers
- Keep `"use client"` boundaries as low in the tree as possible
- Use `loading.tsx` for Suspense boundaries
- Use `error.tsx` for error boundaries
- Route Handlers (`route.ts`) for API proxy — never expose backend URL to client
- Fetch data in Server Components, not in useEffect
- Use proper metadata exports for SEO
