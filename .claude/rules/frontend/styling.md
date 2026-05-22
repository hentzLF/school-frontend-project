---
paths:
  - "src/**/*.{tsx,jsx,css}"
---
# Styling Rules

- Tailwind CSS only — no CSS-in-JS, no inline styles
- Use shadcn/ui components from `src/components/ui/`
- Use `cn()` utility for conditional class merging
- Responsive design: mobile-first (`sm:`, `md:`, `lg:`)
- Dark mode support via Tailwind `dark:` variant
- No magic color values — use Tailwind theme colors
