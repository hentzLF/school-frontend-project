# Testing Requirements

## Minimum Coverage: 80%

1. **Unit Tests** (Vitest + React Testing Library) — components, hooks, utilities
2. **E2E Tests** (Playwright) — critical user flows

## Test Naming

```typescript
describe('LoginForm', () => {
  it('should show validation error for empty email', () => {});
  it('should redirect to dashboard on successful login', () => {});
});
```

## AAA Pattern

```typescript
it('should display user name', () => {
  // Arrange
  const user = { name: 'John' };

  // Act
  render(<UserCard user={user} />);

  // Assert
  expect(screen.getByText('John')).toBeInTheDocument();
});
```
