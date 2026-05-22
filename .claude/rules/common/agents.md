# Agent Orchestration

## Available Agents

| Agent          | Model  | Purpose                                                 |
| -------------- | ------ | ------------------------------------------------------- |
| orchestrator   | Opus   | Plans and delegates — NEVER writes code                 |
| coder          | Sonnet | Writes/modifies code, always runs `npm run build` after |
| react-reviewer | Sonnet | React/Next.js/TypeScript review, accessibility          |
| tester         | Sonnet | Runs tests, reports pass/fail and coverage              |
| reporter       | Haiku  | Writes progress reports to `reports/` folder            |

## Orchestration Flow

```
orchestrator (Opus)
  ├─► coder           → implement changes
  ├─► react-reviewer  → review (patterns, a11y, security)
  ├─► tester          → verify tests pass
  └─► reporter        → log progress to reports/
```
