---
name: security-review
description: Use this skill when handling user input, authentication, API integration, or sensitive data in the React/Next.js frontend.
---

# Security Review — React/Next.js

## Checklist

### 1. Authentication
- [ ] JWT stored in HttpOnly cookies only — never localStorage/sessionStorage
- [ ] Refresh tokens also HttpOnly
- [ ] Auth state managed server-side via Route Handlers
- [ ] Protected routes check auth before rendering
- [ ] Logout clears all tokens and cookies

### 2. XSS Prevention
- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitization
- [ ] User input never rendered as raw HTML
- [ ] React's built-in escaping used correctly
- [ ] No inline event handlers with user data

### 3. API Security
- [ ] All backend calls proxied through `src/app/api/` Route Handlers
- [ ] Backend URL never exposed to client-side code
- [ ] No secrets in client-side environment variables (only `NEXT_PUBLIC_*`)
- [ ] API errors don't leak internal details to the user

### 4. Input Validation
- [ ] All form inputs validated with Zod schemas
- [ ] File uploads restricted (size, type) if applicable
- [ ] URL parameters validated before use

### 5. Data Exposure
- [ ] No sensitive data in client-side state (Zustand stores)
- [ ] No console.log with sensitive data
- [ ] No sensitive data in URL query parameters
- [ ] Server Components don't pass secrets to Client Components as props
