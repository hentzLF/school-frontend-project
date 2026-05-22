---
name: build-test
description: Build, lint, and test the frontend project. Use when you need to verify code compiles and tests pass.
allowed-tools: Bash(npm *)
---

# Build & Test

Run the full build and test pipeline for the AgriMarket frontend.

## Steps

1. **Lint** — check code quality:

```bash
npm run lint
```

2. **Build** — compile the project:

```bash
npm run build
```

3. **Unit tests**:

```bash
npm run test -- --run
```

4. **Coverage** (when a coverage report is requested):

```bash
npm run test -- --coverage
```
