---
paths:
  - "**/*.{ts,tsx}"
---
# TypeScript Rules

- Strict mode enabled — no implicit `any`
- Use `type` over `interface` for object shapes
- No `any` — use `unknown` and narrow with type guards
- No non-null assertions (`!`) — use optional chaining and null checks
- Prefer type guards (`is`, `in`, narrowing) over type assertions (`as`)
- Exported functions should have explicit return types
- Use Zod for runtime validation at system boundaries
- Use `satisfies` operator for type-safe object literals
