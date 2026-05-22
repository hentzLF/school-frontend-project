---
paths:
  - "src/**/*.{tsx,jsx,ts}"
---

# React Component Rules

- Functional components with hooks only (no class components)
- Components under 200 lines — extract sub-components
- Named exports only (no default exports)
- Props defined with `type` (not `interface`)
- Extract complex logic to custom hooks in `src/hooks/`
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`
- Never use array index as key in dynamic lists
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`
