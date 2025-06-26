---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.test.js", "*.test.jsx", "*.test.ts", "*.test.tsx", "*.spec.js"]
contexts: ["testing", "development"]
conflicts_with: []
extends: ["../GUIDELINES.md"]
last_updated: "2024-06-26"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
  context_activation: "file_pattern"
---

# Testing Context Guidelines

## Extends: ../GUIDELINES.md

This document provides testing-specific guidelines that apply when working with test files.

## Testing-Specific Rules

### Test File Organization
```extend:test-structure
/**
 * Test Structure - Extension
 * Additional rules for test file organization
 */
// Test files should mirror the component structure:
// src/components/MyComponent/MyComponent.js
// src/components/MyComponent/__tests__/MyComponent.test.js
// src/components/MyComponent/__tests__/__snapshots__/MyComponent.test.js.snap
```

### Snapshot Testing Strategy
```override:snapshot-testing
/**
 * Snapshot Testing - Override
 * Specific snapshot testing approach for this project
 */
// Prioritize snapshot testing for:
// - Configuration objects and complex state structures
// - Component render output for regression detection
// - Redux action creators and reducers
// 
// Update snapshots systematically:
// npm run test:dev (then press 'u' when prompted)
// npm run test:ci -- --updateSnapshot (for bulk updates)
```

### Test Naming Conventions
- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests using `describe` blocks
- Use `it.each` for parameterized tests

### Mocking Strategies
```merge:mocking-patterns
/**
 * Mocking Patterns - Merge  
 * Testing-specific mocking approaches
 */
// Mock external dependencies at the module level
// Use dependency injection patterns for easier testing
// Mock React Redux hooks when testing connected components
// Preserve original implementations for integration-style tests

jest.mock('../../redux', () => ({
  storeHooks: {
    reactRedux: {
      useDispatch: jest.fn(),
      useSelector: jest.fn()
    }
  }
}));
```

### Testing Performance
- Test files should run quickly (under 100ms per test when possible)
- Use `beforeAll` and `afterAll` for expensive setup/teardown
- Mock time-dependent operations (Date, setTimeout, etc.)
- Avoid real API calls in unit tests

### Accessibility Testing
```extend:accessibility-testing
/**
 * Accessibility Testing - Extension
 * Additional a11y testing requirements
 */
// Include accessibility testing for interactive components:
// - Test keyboard navigation
// - Test screen reader compatibility
// - Test focus management
// - Use @testing-library/jest-dom for a11y assertions

import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

<!-- CONTEXT_ACTIVE: testing,*.test.js -->
<!-- CONFLICT_OVERRIDE: snapshot-strategy -->
<!-- CONFLICT_EXTENDED: accessibility-testing --> 