---
paths:
  - "src/**/forms/**"
  - "src/**/*Form*"
  - "src/**/*form*"
---
# Form Rules

- Use React Hook Form for form state management
- Use Zod schemas for validation — define schema first, derive types with `z.infer`
- Display validation errors inline next to the field
- Disable submit button while submitting (prevent double-submit)
- Show loading indicator during submission
- Handle server errors and display user-friendly messages
- Use `"use client"` for form components (they need interactivity)
