---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.test.js", "*.spec.js", "*.test.jsx", "*.spec.jsx", "*.test.ts", "*.spec.ts", "*.test.tsx", "*.spec.tsx"]
contexts: ["development", "testing", "review"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["testing", "unit testing", "jest", "testing library", "mocking", "dependency injection"]
  related_guidelines: ["guidelines/code-style/javascript-react.md", "guidelines/component-architecture/component-patterns.md"]
  importance: "high"
  code_examples: true
---

# Testing Practices

## Overview

This document provides detailed guidelines for testing in the Curiosity Frontend application.

## Unit Testing

1. **Test behavior, not implementation** - Focus on what the component does not the resource used. Assume resources are already tested.
2. **Use descriptive test names** - Clearly state what is being tested
3. **Follow AAA pattern** - Arrange, Act, Assert

```javascript
describe('MyComponent', () => {
  it('should display loading state when data is being fetched', () => {
    // Arrange
    const props = { loading: true };

    // Act
    render(<MyComponent {...props} />);

    // Assert
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', async () => {
    // Arrange
    const mockOnSave = jest.fn();
    render(<MyComponent onSave={mockOnSave} />);

    // Act
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });
});
```

## Testing Best Practices

1. **Test user interactions** - Use `@testing-library/user-event`
2. **Mock external dependencies** - APIs, complex utilities, etc.
3. **Test error boundaries** - Ensure error states are handled
4. **Snapshot testing for configuration** - Use for config objects and component structure
5. **Consolidate similar tests** - Group related test cases to reduce duplication
6. **Use data-testid** for complex queries, but prefer semantic queries

## Project-Specific Testing Patterns

- Consolidate multiple product configuration tests into bulk tests
- Update snapshots systematically when making architectural changes
- Use descriptive test file organization matching component structure
- Test component context and helpers alongside main components

## Testing with Dependency Injection

The project's dependency injection pattern makes testing much easier:

```javascript
// Component with dependency injection
const MyComponent = ({ 
  useProductContext: useAliasProductContext = useProductContext 
} = {}) => {
  const { productId } = useAliasProductContext();
  // Component implementation
};

// Test with mocked dependencies
describe('MyComponent', () => {
  it('should render with mocked context', () => {
    const mockUseProductContext = jest.fn(() => ({
      productId: 'test-product'
    }));

    render(
      <MyComponent useProductContext={mockUseProductContext} />
    );

    // Assertions
  });
});
```

## Running Tests

### Unit Tests
```bash
# Run unit tests with watch mode during development
npm run test:dev

# Run all unit tests with coverage
npm test

# Clear Jest cache if tests aren't updating properly
npm run test:clearCache

# Update test snapshots
# Run npm run test:dev and press 'u' when prompted
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run integration tests in development mode
npm run test:integration-dev
```

### Linting and Spell Checking
```bash
# Run linting
npm run test:lint

# Fix linting issues automatically
npm run test:lintfix

# Run spell checking
npm run test:spell
```

## Testing Redux

When testing components that use Redux, leverage the dependency injection pattern to mock the Redux hooks:

```javascript
describe('ComponentWithRedux', () => {
  it('should dispatch action on button click', () => {
    // Mock dispatch
    const mockDispatch = jest.fn();
    const mockUseDispatch = jest.fn(() => mockDispatch);

    // Mock selector
    const mockData = { test: 'data' };
    const mockUseSelector = jest.fn(() => mockData);

    render(
      <ComponentWithRedux 
        useDispatch={mockUseDispatch}
        useSelector={mockUseSelector}
      />
    );

    // Trigger action
    fireEvent.click(screen.getByRole('button'));

    // Assert dispatch was called with expected action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'EXPECTED_ACTION',
      payload: expect.any(Object)
    });
  });
});
```

## Testing Async Components

For components with asynchronous behavior:

```javascript
describe('AsyncComponent', () => {
  it('should show loading state then data', async () => {
    // Mock async data fetch
    const mockData = { items: ['item1', 'item2'] };
    const mockFetch = jest.fn().mockResolvedValue(mockData);

    render(<AsyncComponent fetchData={mockFetch} />);

    // Assert loading state is shown initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for data to load
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading'));

    // Assert data is displayed
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
  });

  it('should handle errors', async () => {
    // Mock failed fetch
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    render(<AsyncComponent fetchData={mockFetch} />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## Testing Accessibility

Include accessibility testing in your test suite:

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('AccessibleComponent', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AccessibleComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```
