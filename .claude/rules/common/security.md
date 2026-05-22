# Security Guidelines

## Mandatory Checks

- [ ] No hardcoded secrets (API keys, tokens, URLs)
- [ ] All user inputs validated (Zod schemas)
- [ ] XSS prevention (no dangerouslySetInnerHTML without sanitization)
- [ ] JWT tokens in HttpOnly cookies only (never localStorage)
- [ ] Backend calls proxied through Route Handlers
- [ ] No sensitive data in client-side code or logs
- [ ] CSRF protection via SameSite cookies
