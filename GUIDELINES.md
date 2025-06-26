---
guideline_version: "1.0.0"
priority: 1
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.scss", "*.css", "*.json", "*.md"]
contexts: ["development", "testing", "review", "build"]
conflicts_with: []
extends: []
last_updated: "2024-06-26"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
---

# Curiosity Frontend Development Guidelines

This document provides comprehensive development guidelines for the Curiosity Frontend application, a React-based dashboard for Red Hat Subscription Management.

## Guideline Inheritance and External References

This project supports multiple layers of guideline inheritance to accommodate different development environments and organizational standards.

### Guideline guidance
1. ONLY **Base Guidelines** (`GUIDELINES.md`) should be git committed. All other guidelines should be gitignored
1. **Local Guidelines** (`GUIDELINES.local.md`) may, or may not exist. It is not a required file.

### Precedence Chain
Guidelines are merged with the following precedence (highest to lowest):

1. **Agent Specific Guidelines** - Priority 10
1. **Local Guidelines** (`GUIDELINES.local.md`) - Priority 5
2. **Base Guidelines** (`GUIDELINES.md`) - Priority 1

### Examples
**Guideline file structure example:**
```
Project
├── GUIDELINES.md
├── GUIDELINES.local.md
└── Agent Specific Guidelines
```

**Guideline inheritance and priority structure example:**

```
Project
└── GUIDELINES.md
    └── GUIDELINES.local.md
        └── Agent Specific Guidelines
```

**Guideline inheritance and priority structure markdown example:**
```
Project
└── GUIDELINES.md
    ├── Link to external GUIDELINES.md
    ├── Guideline Heading
    └── GUIDELINES.local.md
        ├── Link to external GUIDELINES.md
        │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
        │   └── If guideline exists in parent priority order then append it to existing guidelines
        ├── Guideline Heading
        │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
        │   └── If guideline exists in parent priority order then append it to existing guidelines
        ├── Guideline Heading - Override
        │   └── "Override" keyword indicates guideline removes the conflicting guideline. It may provide opposing, or counter, guidenance
        └── Agent Specific Guidelines
            ├── Link to external GUIDELINES.md
            │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
            │   └── If guideline exists in parent priority order then append it to existing guidelines
            ├── Guideline Heading
            │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
            │   └── If guideline exists in parent priority order then append it to existing guidelines
            └── Guideline Heading - Override
                └── "Override" keyword indicates guideline removes the conflicting guideline. It may provide opposing, or counter, guidenance
```

## Merge Resolution and Conflict Detection

### Merge Resolution Markers

The following markers can be used in higher-priority guideline files to explicitly control how conflicting guidelines are resolved:

#### Override Example (Replaces conflicting guideline)
```override:react-component-structure
/**
 * Component Structure - Override
 * This completely replaces any base guidelines for React component structure
 */
const MyComponent = ({ prop1, prop2 = defaultValue }) => {
  // TypeScript-style component with explicit interfaces
  // This overrides the JSDoc approach in base guidelines
  return <div>{/* Component JSX */}</div>;
};
```

#### Extend Example (Adds to existing guideline)
```extend:import-patterns
/**
 * Import Organization - Extension
 * This adds to existing import organization rules from base guidelines
 */
// Additional rule: Always separate React imports from other libraries
import React, { useState, useEffect } from 'react';

import { Button } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';
import _cloneDeep from 'lodash/cloneDeep';
```

#### Merge Example (Combines with existing guideline)
```merge:testing-practices
/**
 * Testing Practices - Merge
 * This merges with existing testing practices from base guidelines
 */
// Additional testing requirements beyond base guidelines:
// - Add performance testing for components with >100 props
// - Include accessibility testing for all interactive components
// - Test React Suspense boundaries where applicable
describe('MyComponent Performance', () => {
  it('should render within 16ms for 60fps', () => {
    // Performance test implementation
  });
});
```

### Conflict Detection Annotations

#### Common Conflicts and Resolutions

**CONFLICT: Component Prop Documentation**
- Base Guidelines: Use JSDoc comments for prop documentation
- Local Guidelines: Use TypeScript interfaces for props
- Resolution: Higher priority guideline takes precedence
- Annotation: `<!-- CONFLICT_RESOLVED: prop-documentation -->` 

**CONFLICT: Import Organization**
- Base Guidelines: Three-tier import organization (external, internal, relative)
- Local Guidelines: Four-tier with React separated
- Resolution: Merge both approaches - use four-tier when React is present
- Annotation: `<!-- CONFLICT_MERGED: import-organization -->`

**CONFLICT: Testing Strategy**
- Base Guidelines: Standard Jest + Testing Library
- Agent Guidelines: Add performance and accessibility tests
- Resolution: Extend base strategy with additional requirements
- Annotation: `<!-- CONFLICT_EXTENDED: testing-strategy -->`

### Backward Compatibility Notes

For agents that don't understand merge resolution markers:
1. All existing guidelines remain valid and functional
2. New markers appear as code blocks and can be ignored
3. Conflict annotations appear as HTML comments and don't affect functionality
4. Traditional inheritance still works: higher priority files override lower priority

### Agent Processing Instructions

1. **Parse YAML frontmatter** to determine file priority and context
2. **Look for merge markers** (`override:`, `extend:`, `merge:`) in higher-priority files
3. **Check conflict annotations** to understand resolution strategies
4. **Apply merge strategy**:
   - `override`: Replace lower-priority guideline completely
   - `extend`: Add to existing guideline while preserving original
   - `merge`: Combine guidelines using logical union
5. **Fallback behavior**: If no markers present, use traditional "higher priority wins" approach

# AI Agent Guidelines for Frontend Development

This document provides comprehensive guidelines for AI agents working on frontend codebases, particularly React applications with Redux state management, testing frameworks, and component-based architecture.

## Table of Contents

1. [Project Understanding](#project-understanding)
2. [Code Style and Conventions](#code-style-and-conventions)
3. [Patterns from cabrera.code/ccabrera Analysis](#patterns-from-cabreracodeccabrera-analysis)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Testing Practices](#testing-practices)
7. [File Organization](#file-organization)
8. [Git Workflow](#git-workflow)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Performance Considerations](#performance-considerations)
11. [Internationalization (i18n)](#internationalization-i18n)
12. [Error Handling](#error-handling)
13. [Documentation Standards](#documentation-standards)
14. [Build and Development Practices](#build-and-development-practices)

## Project Understanding

### Before Making Changes

1. **Analyze the project structure** - Understand the component hierarchy, service layer, and data flow
2. **Review existing patterns** - Follow established conventions rather than introducing new ones
3. **Check dependencies** - Understand the key libraries and frameworks in use
4. **Read documentation** - Review README.md, CONTRIBUTING.md, and any existing guidelines
5. **Understand the build process** - Review package.json scripts and build configuration

### Key Technologies to Recognize

- **React 18+** with functional components and hooks
- **Redux** for state management with middleware
- **PatternFly** for UI components and design system
- **Jest** and **Testing Library** for unit testing
- **i18next** for internationalization
- **SCSS** for styling
- **ESLint** and **Prettier** for code quality

## Code Style and Conventions

### JavaScript/React

1. **Use functional components** with hooks rather than class components
2. **React 19 Preparation**:
  - Use **default parameters** instead of `defaultProps`
  - Use **JSDoc comments** instead of `PropTypes` for type documentation
3. **Defensive programming practices** (from cabrera.code/ccabrera):
  - Always use `typeof callback === 'function'` instead of just `if (callback)`
  - Implement proper type checking before function calls
  - Use optional chaining (`?.`) when appropriate
4. **Import and Export Patterns** (analyzed from codebase patterns):

### Import Organization
   ```javascript
   // External libraries first (React, third-party packages)
   import React from 'react';
   import { ExportIcon } from '@patternfly/react-icons';
   import _cloneDeep from 'lodash/cloneDeep';
   
   // Internal modules (services, redux, common) second
   import { reduxActions, storeHooks } from '../../redux';
   import { PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES } from '../../services/platform/platformConstants';
   
   // Relative imports (components, utilities) last
   import { useProduct } from '../productView/productViewContext';
   import { Select, SelectButtonVariant } from '../form/select';
   import { translate } from '../i18n/i18n';
   import { dateHelpers, helpers } from '../../common';
   ```

### Import Aliasing
   ```javascript
   // Use descriptive aliases for long constant names
   import {
     PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
     PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
     PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES
   } from '../../services/platform/platformConstants';
   
   // Import aggregated objects from common modules
   import { dateHelpers, helpers } from '../../common';
   
   // Import renamed context objects
   import { context as routerContext } from './routerContext';
   ```

### Export Patterns
**Always provide both default and named exports for maximum flexibility:**

   ```javascript
   // For components - export main component plus utilities
   export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
   
   // For utility modules - export aggregation object plus individual items
   export { helpers as default, helpers, dateHelpers, downloadHelpers };
   
   // For constants modules - create aggregation object, then export everything
   const platformConstants = {
     PLATFORM_API_EXPORT_APPLICATION_TYPES,
     PLATFORM_API_EXPORT_CONTENT_TYPES,
     // ... all constants
   };
   
   export {
     platformConstants as default,
     platformConstants,
     PLATFORM_API_EXPORT_APPLICATION_TYPES,
     PLATFORM_API_EXPORT_CONTENT_TYPES,
     // ... all individual constants
   };
   ```

### Index File Patterns
**Use index files to aggregate and re-export modules:**

   ```javascript
   // Import with destructuring from individual modules
   import { platformActions } from './platformActions';
   import { rhsmActions } from './rhsmActions';
   import { userActions } from './userActions';

   // Create aggregation objects when logical grouping is needed
   const actions = {
     platform: platformActions,
     rhsm: rhsmActions,
     user: userActions
   };

   const reduxActions = { ...actions };

   // Always provide both default and named exports
   export { reduxActions as default, reduxActions, platformActions, rhsmActions, userActions };
   ```

5. **Follow naming conventions**:
  - Components: PascalCase (`MyComponent`)
  - Files: camelCase matching component name (`inventoryCard.js`, `graphCardHelpers.js`)
  - Variables and functions: camelCase (`myVariable`, `myFunction`)
  - Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)

6. **Destructuring preferences**:
   ```javascript
   // Prefer destructuring
   const { loading, error, data } = useSelector(state => state.myReducer);
   
   // Use meaningful prop destructuring with default parameters (React 19 ready)
   const MyComponent = ({ title, onSave, isDisabled = false }) => {
     // Component logic
   };
   ```

### CSS/SCSS

1. **Use BEM methodology** for CSS class naming
2. **Follow existing SCSS structure** and variables
3. **Prefer CSS modules or styled-components** when available
4. **Use semantic class names** that describe purpose, not appearance

## Patterns from cabrera.code/ccabrera Analysis

Based on extensive commit history analysis of cabrera.code and ccabrera, the following patterns have been identified and should be followed:

### Defensive Programming

1. **Function type checking**:
   ```javascript
   // Good - Always check typeof before calling
   if (typeof callback === 'function') {
     return callback({ tick });
   }
   
   // Avoid - Just truthy check
   if (callback) {
     return callback({ tick });
   }
   ```

2. **Robust error handling** - Always validate inputs before processing

### Component Architecture Patterns

1. **Context-based component design**:
  - Create separate context files for complex components (`inventoryCardInstancesContext.js`)
  - Use dependency injection through hooks for reusable components
  - Separate concerns between component logic and data fetching

2. **Helper file organization**:
  - Create dedicated helper files for complex logic (`graphCardHelpers.js`, `inventoryCardHelpers.js`)
  - Keep helpers pure functions when possible
  - Group related utilities together

### Migration and Refactoring Approach

1. **Incremental migrations**:
  - Migrate components to new patterns systematically
  - Update tests alongside component changes
  - Consolidate similar configurations into bulk operations

2. **Library upgrades**:
  - Update to latest stable versions (React 18, PatternFly composable tables)
  - Maintain backward compatibility during transitions
  - Update snapshots and tests comprehensively

### File and Component Naming

1. **Consistent naming patterns**:
  - Match file names to primary component export
  - Use camelCase for JavaScript files
  - Use descriptive names that indicate purpose (`inventoryCardInstances` not `instances`)

### Testing Strategy

1. **Comprehensive test coverage**:
  - Test contexts alongside components
  - Use snapshot testing for configuration objects
  - Consolidate repetitive tests to reduce duplication
  - Update test snapshots systematically after architectural changes

### Commit and Issue Management

1. **Structured commit messages**:
  - Always include JIRA issue numbers (`sw-####`)
  - Use conventional commit types (`feat`, `fix`, `refactor`, `chore`)
  - Scope commits to specific components or areas
  - Group logically related changes in single commits

2. **Pull request patterns**:
  - Include comprehensive descriptions of changes
  - Reference related issues and dependencies
  - Update documentation alongside code changes

## Component Architecture

### Component Structure

1. **Single Responsibility Principle** - Each component should have one clear purpose
2. **Composition over inheritance** - Build complex UIs by combining simple components
3. **Container vs Presentational** - Separate data logic from presentation logic

### Component Patterns

```javascript
/**
 * Standard functional component structure
 *
 * @param {object} props - Component props
 * @param {string} props.prop1 - Required string prop
 * @param {number} [props.prop2] - Optional number prop
 * @param {Function} [props.onAction] - Optional callback function
 * @param {object} [props.otherProps] - Additional props to spread
 * @returns {JSX.Element}
 */
const MyComponent = ({ 
  prop1, 
  prop2 = 0, // Default parameter instead of defaultProps
  onAction,
  ...otherProps 
}) => {
  // Hooks at the top
  const [localState, setLocalState] = useState(initialValue);
  const dispatch = useDispatch();
  const selectorData = useSelector(selectMyData);
  
  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleAction = useCallback((event) => {
    // Handle event
    onAction?.(event);
  }, [onAction]);
  
  // Early returns for loading/error states
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  // Main render
  return (
    <div className="my-component" {...otherProps}>
      {/* Component JSX */}
    </div>
  );
};

export { MyComponent as default, Mycomponent };
```

### Function Dependency Injection Patterns

**Prefer dependency injection through function parameters over direct imports for better testability and modularity:**

```javascript
// ✅ Good - Dependency injection with default parameters and aliasing
const useProductGraphConfig = ({ 
  useProductContext: useAliasProductContext = useProductContext 
} = {}) => {
  const { initialGraphFilters, initialGraphSettings = {} } = useAliasProductContext();
  return {
    filters: initialGraphFilters,
    settings: initialGraphSettings
  };
};

// ✅ Good - Service function with configurable dependencies
const getInstancesInventory = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.instances, rhsmSchemas.errors],
    transform = [rhsmTransformers.instances]
  } = options;
  return serviceCall({ url, params, cache, cancel, cancelId, schema, transform });
};

// ✅ Good - Multiple dependency injection with aliasing
const translate = (
  translateKey,
  values = null,
  components,
  {
    i18next: aliasI18next = i18next,
    isDebug = helpers.TEST_MODE,
    noopTranslate: aliasNoopTranslate = noopTranslate,
    parseContext: aliasParseContext = parseContext,
    parseTranslateKey: aliasParseTranslateKey = parseTranslateKey
  } = {}
) => {
  // Function implementation using injected dependencies
  if (aliasI18next.store) {
    return aliasI18next.t(translateKey, values);
  }
  return aliasNoopTranslate(translateKey, values, components);
};

// ✅ Good - Middleware configuration with dependency injection
const axiosServiceCall = async (
  config = {},
  {
    cancelledMessage = 'cancelled request',
    responseCache = globalResponseCache,
    xhrTimeout = globalXhrTimeout,
    pollInterval = globalPollInterval
  } = {}
) => {
  // Implementation using injected dependencies
};

// ❌ Avoid - Direct dependency imports in function body unless they are directly from React
const useProductGraphConfig = () => {
  const { initialGraphFilters, initialGraphSettings } = useProductContext(); // Direct import
  // ...
};
```

**Naming Convention for Injected Dependencies:**
- Use `alias` prefix for injected parameters: `aliasI18next`, `useAliasProductContext`
- Keep original parameter names descriptive: `useProductContext: useAliasProductContext`
- Always provide default values for injected dependencies

**Advanced Dependency Injection Patterns from cabrera.code/ccabrera:**

```javascript
// ✅ Pattern: Composable hook injection for configuration
const useProductToolbarQuery = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  useProductInventoryHostsQuery: useAliasProductInventoryHostsQuery = useProductInventoryHostsQuery,
  options
} = {}) => ({
  ...useAliasProductQuery({ options }),
  ...useAliasProductGraphTallyQuery({ options }),
  ...useAliasProductInventoryHostsQuery({ options })
});

// ✅ Pattern: Service layer with configurable transformers and schemas
const getBillingAccounts = async (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [platformSchemas.billingAccounts, rhsmSchemas.errors],
    transform = [platformTransformers.billingAccounts]
  } = options;
  // Implementation with injected schema and transform dependencies
};

// ✅ Pattern: Component HOC with dependency injection
const translateComponent = (
  Component,
  { i18next: aliasI18next = i18next, noopTranslate: aliasNoopTranslate = noopTranslate } = {}
) => {
  const withTranslation = ({ ...props }) => (
    <Component
      {...props}
      t={(aliasI18next.store && translate) || aliasNoopTranslate}
      i18n={(aliasI18next.store && aliasI18next) || helpers.noop}
    />
  );
  withTranslation.displayName = 'withTranslation';
  return withTranslation;
};
```

**Testing with Dependency Injection:**

```javascript
// ✅ Easy to test with mocked dependencies
describe('useProductGraphConfig', () => {
  it('should return graph configuration', () => {
    const mockUseProductContext = jest.fn(() => ({
      initialGraphFilters: ['filter1'],
      initialGraphSettings: { setting: 'value' }
    }));
    
    const result = useProductGraphConfig({ 
      useProductContext: mockUseProductContext 
    });
    
    expect(result.filters).toEqual(['filter1']);
    expect(result.settings).toEqual({ setting: 'value' });
  });
});
```

### Context Usage

1. **Use Context sparingly** - Only for truly global state or component trees
2. **Create focused contexts** - Avoid massive context objects
3. **Provide meaningful defaults** - Always include fallback values

## State Management

### Internal Redux Patterns (Preferred over Redux Toolkit)

This codebase uses a sophisticated internal Redux architecture with custom hooks and helpers. **Always favor these internal utilities over Redux Toolkit:**

#### **1. Internal Hooks (storeHooks.reactRedux)**

```javascript
// ✅ Preferred - Use internal hooks with dependency injection
import { storeHooks } from '../../redux';

const useMyComponent = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const response = useAliasSelectorsResponse([
    { id: 'data', selector: ({ myFeature }) => myFeature.data },
    { id: 'config', selector: ({ myFeature }) => myFeature.config }
  ]);
  
  return { dispatch, ...response };
};

// ❌ Avoid - Direct Redux Toolkit hooks
import { useDispatch, useSelector } from 'react-redux';
```

#### **2. Advanced Selector Patterns**

```javascript
// ✅ Multiple selectors with Promise-like responses
const { data, pending, fulfilled, error } = storeHooks.reactRedux.useSelectorsResponse([
  { id: 'auth', selector: ({ app }) => app?.auth },
  { id: 'locale', selector: ({ app }) => app?.locale },
  { id: 'errors', selector: ({ app }) => app?.errors }
]);

// ✅ Promise.all-like behavior - waits for all to complete
const response = storeHooks.reactRedux.useSelectorsAllSettledResponse(selectors);

// ✅ Promise.race-like behavior - returns first completed
const response = storeHooks.reactRedux.useSelectorsRaceResponse(selectors);

// ✅ Promise.any-like behavior - returns first successful
const response = storeHooks.reactRedux.useSelectorsAnyResponse(selectors);
```

#### **3. Generated Promise Action Reducers**

```javascript
// ✅ Preferred - Auto-generated reducers using reduxHelpers
import { reduxHelpers } from '../common/reduxHelpers';

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CUSTOM_ACTION':
      return reduxHelpers.setStateProp('customData', action.payload, {
        state,
        reset: false
      });
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'data', type: 'GET_MY_DATA' },
          { ref: 'config', type: 'GET_MY_CONFIG' }
        ],
        state,
        action
      );
  }
};

// ❌ Avoid - Manual promise state management
const manualReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DATA_PENDING':
      return { ...state, loading: true };
    case 'GET_DATA_FULFILLED':
      return { ...state, loading: false, data: action.payload };
    // Manual error handling...
  }
};
```

#### **4. Internal Redux Helpers**

```javascript
// ✅ State management utilities
import { reduxHelpers } from '../common/reduxHelpers';

// Promise action suffixes
const pendingType = reduxHelpers.PENDING_ACTION('MY_ACTION'); // 'MY_ACTION_PENDING'
const fulfilledType = reduxHelpers.FULFILLED_ACTION('MY_ACTION'); // 'MY_ACTION_FULFILLED'
const rejectedType = reduxHelpers.REJECTED_ACTION('MY_ACTION'); // 'MY_ACTION_REJECTED'

// API query normalization
const query = reduxHelpers.setApiQuery(values, schema, defaultValue);

// Response data extraction
const data = reduxHelpers.getDataFromResults(action);
const status = reduxHelpers.getStatusFromResults(action);
const message = reduxHelpers.getMessageFromResults(action);

// State property updates with reset capability
const newState = reduxHelpers.setStateProp('propertyName', newData, {
  state: currentState,
  initialState,
  reset: true // Merge with initial state
});
```

#### **5. Custom Selector Creation**

```javascript
// ✅ Memoized selector composition
const multiSelector = storeHooks.reactRedux.createSimpleSelector(
  [selectorOne, selectorTwo],
  (resultOne, resultTwo) => ({ resultOne, resultTwo })
);

// ✅ Deep equality comparison (preferred over shallow)
const result = storeHooks.reactRedux.useSelector(
  mySelector,
  defaultValue,
  { equality: storeHooks.reactRedux.deepEqual }
);
```

#### **6. Multi-Action Dispatch Patterns**

```javascript
// ✅ Dispatch multiple actions at once
const dispatch = storeHooks.reactRedux.useDispatch();

dispatch([
  {
    type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
    viewId: productId
  },
  {
    type: reduxTypes.query.SET_QUERY,
    viewId: productId,
    filter: RHSM_API_QUERY_SET_TYPES.USAGE,
    value
  }
]);
```

### Key Benefits of Internal Redux Architecture

1. **Promise-like State Management** - Built-in pending/fulfilled/error states
2. **Automatic Reducer Generation** - Less boilerplate than Redux Toolkit
3. **Advanced Selector Composition** - Multiple Promise patterns (all, race, any)
4. **Deep Equality Memoization** - Better performance for complex objects when combined with service response caching
5. **Dependency Injection** - Highly testable and modular
6. **Built-in Response Normalization** - Automatic API response handling

### Local State vs Global State

1. **Local state first** - Use `useState` for component-specific state
2. **Lift state up** only when multiple components need the same data
3. **Global state** for truly application-wide state (user, auth, etc.)

## Testing Practices

### Unit Testing

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

### Testing Best Practices

1. **Test user interactions** - Use `@testing-library/user-event`
2. **Mock external dependencies** - APIs, complex utilities, etc.
3. **Test error boundaries** - Ensure error states are handled
4. **Snapshot testing for configuration** - Use for config objects and component structure
5. **Consolidate similar tests** - Group related test cases to reduce duplication
6. **Use data-testid** for complex queries, but prefer semantic queries

**Patterns from cabrera.code/ccabrera:**
- Consolidate multiple product configuration tests into bulk tests
- Update snapshots systematically when making architectural changes
- Use descriptive test file organization matching component structure
- Test component context and helpers alongside main components

## File Organization

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── MyComponent/
│   │   ├── __tests__/   # Component tests
│   │   ├── index.js     # Main component file
│   │   └── myComponent.scss
├── hooks/               # Custom React hooks
├── services/           # API calls and external services
├── redux/              # Redux store, actions, reducers
│   ├── actions/
│   ├── reducers/
│   └── selectors/
├── utils/              # Pure utility functions
├── config/             # Configuration files
└── types/              # TypeScript type definitions
```

### File Naming Conventions

1. **Components** - camelCase for the main file, matching folder name
2. **Utilities** - camelCase descriptive names
3. **Constants** - UPPER_SNAKE_CASE or camelCase
4. **Test files** - `*.test.js` or `*.spec.js`

## Git Workflow

### Commit Messages

Follow conventional commit format with issue tracking:
```
type(scope): issue-number description

feat(auth): sw-123 add login functionality
fix(table): sw-456 resolve pagination bug
refactor(components): sw-789 migrate to pf composable table
chore(build): npm updates
```

**Key patterns observed from cabrera.code/ccabrera:**
- Always include issue numbers in format `sw-####` for JIRA tracking
- Use descriptive scopes that match the affected component/area
- Group related changes in single commits when logically connected
- Use "refactor" type for component migrations and architectural changes
- Use "build(deps)" for dependency updates
- Use specific component names in scope (e.g., "graphCardHelpers", "toolbarField")

### Branch Naming

```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue-name
```

### Pull Request Guidelines

1. **Small, focused changes** - One feature or fix per PR
2. **Clear descriptions** - Explain what and why, not just how
3. **Test coverage** - Ensure new code has appropriate tests
4. **Update documentation** - Keep docs in sync with code changes

## Accessibility Guidelines

### ARIA and Semantic HTML

1. **Use semantic HTML** - `<button>`, `<nav>`, `<main>`, etc.
2. **Provide ARIA labels** - For complex interactions
3. **Keyboard navigation** - Ensure all interactive elements are keyboard accessible
4. **Focus management** - Handle focus for modals, route changes

```javascript
// Good accessibility practices
<button 
  aria-label="Close dialog"
  onClick={handleClose}
  type="button"
>
  <CloseIcon />
</button>

<input 
  aria-describedby="error-message"
  aria-invalid={hasError}
  type="text"
/>
{hasError && <div id="error-message" role="alert">{error}</div>}
```

### Testing Accessibility

1. **Use axe-core** - Automated accessibility testing
2. **Test with screen readers** - Manual testing when possible
3. **Color contrast** - Ensure sufficient contrast ratios
4. **Responsive design** - Test on various screen sizes

## Performance Considerations

### React Performance

1. **Use React.memo** for expensive components
2. **Optimize re-renders** - Use `useCallback` and `useMemo` appropriately
3. **Lazy loading** - Code split with `React.lazy()` and Suspense
4. **Virtual scrolling** - For large lists

```javascript
// Memoization example
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  const handleClick = useCallback((id) => {
    onAction(id);
  }, [onAction]);
  
  return (
    <div>
      {processedData.map(item => 
        <Item key={item.id} data={item} onClick={handleClick} />
      )}
    </div>
  );
});
```

### Bundle Optimization

1. **Tree shaking** - Import only what you need
2. **Code splitting** - Split by routes or features
3. **Image optimization** - Use appropriate formats and sizes
4. **Minimize dependencies** - Regularly audit and remove unused packages

## Internationalization (i18n)

### i18next Usage

1. **Use translation keys consistently** - Follow established naming patterns
2. **Provide context** - Include descriptions for translators
3. **Handle pluralization** - Use i18next plural forms
4. **Test with different locales** - Ensure UI works with longer text

```javascript
// Translation usage
const { t } = useTranslation();

return (
  <div>
    <h1>{t('common:title')}</h1>
    <p>{t('feature.description', { count: items.length })}</p>
    <button>{t('actions.save')}</button>
  </div>
);
```

### Translation Best Practices

1. **Keep keys descriptive** - Use hierarchical naming
2. **Avoid concatenation** - Use interpolation instead
3. **Consider RTL languages** - Test layout with right-to-left text
4. **Date and number formatting** - Use locale-aware formatting

## Error Handling

### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### API Error Handling

1. **Centralized error handling** - Use interceptors or error boundaries
2. **User-friendly messages** - Transform technical errors to user language
3. **Retry mechanisms** - For network failures
4. **Graceful degradation** - Show partial content when possible

## Documentation Standards

### Code Documentation

1. **JSDoc comments** - For public APIs and complex functions
2. **Component documentation** - Props, usage examples
3. **README files** - For modules and major features
4. **Inline comments** - For complex business logic

```javascript
/**
 * Calculates the total price including taxes
 *
 * @param {number} basePrice - The base price before taxes
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns {number} The total price including taxes
 */
const calculateTotalPrice = (basePrice, taxRate) => {
  return basePrice * (1 + taxRate);
};
```

### API Documentation

1. **Document endpoints** - Method, parameters, responses
2. **Include examples** - Request/response examples
3. **Error codes** - Document possible error responses
4. **Authentication** - How to authenticate requests

## Build and Development Practices

### Environment Configuration

1. **Use environment variables** - For configuration that changes between environments
2. **Validate configuration** - Check required environment variables on startup
3. **Separate concerns** - Development, staging, production configs

### Development Tools

1. **Hot reloading** - Use for efficient development
2. **Linting and formatting** - Run on npm scripts found in `package.json`
3. **Type checking** - Prefer JSDoc comments over TypeScript

### Deployment Considerations

1. **Build optimization** - Minimize and compress assets
2. **Cache strategies** - Implement appropriate caching headers
3. **Health checks** - Include application health endpoints
4. **Monitoring** - Log errors and performance metrics

## Common Pitfalls to Avoid

1. **Mutating state directly** - Always create new objects/arrays
2. **Missing dependency arrays** - In useEffect, useCallback, useMemo
3. **Not handling loading states** - Always show appropriate feedback
4. **Ignoring accessibility** - Consider users with disabilities
5. **Over-optimizing** - Profile before optimizing
6. **Inconsistent error handling** - Handle errors at appropriate levels
7. **Missing prop documentation** - Use JSDoc comments or TypeScript for prop documentation
8. **Not testing edge cases** - Test loading, error, and empty states
9. **Ignoring dependency injection patterns**:
   ```javascript
   // Problematic - No dependency injection
   const useMyHook = () => {
     const context = useContext(MyContext); // Directly imported
     return context.data;
   };
   
   // Better - With dependency injection
   const useMyHook = ({ useMyContext: useAliasMyContext = useMyContext } = {}) => {
     const context = useAliasMyContext();
     return context.data;
   };
   ```
10. **Not aliasing injected dependencies**:
   ```javascript
   // Problematic - Confusing parameter names
   const myFunction = ({ useProductContext } = {}) => {
     // Unclear which useProductContext is being used
   };
   
   // Better - Clear aliasing
   const myFunction = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
     // Clear distinction between injected and default
   };
   ```
11. **Missing default values for injected dependencies**:
   ```javascript
   // Problematic - No defaults
   const myFunction = ({ serviceCall, transform }) => {
     // Will break if not provided
   };
   
   // Better - Proper defaults
   const myFunction = ({ 
     serviceCall = defaultServiceCall, 
     transform = defaultTransform 
   } = {}) => {
     // Always has fallbacks
   };
   ```

## Additional Pitfalls to Avoid from cabrera.code/ccabrera Analysis

12. **Fragmented test files** - Consolidate similar tests instead of creating many small test files. Multiple describe statements can be used.

13. **Inconsistent component context patterns** - Always create context files for complex state management

14. **Missing issue tracking in commits** - Always include JIRA issue numbers in commit messages

15. **Incomplete migration patterns** - When refactoring, update all related files (tests, snapshots, dependencies) in the same commit

16. **Shallow equality checks in hooks** - Prefer deep equality for complex objects (useReactRedux pattern)

## Redux Anti-Patterns (Specific to Internal Architecture)

17. **Using Redux Toolkit instead of internal hooks**:
   ```javascript
   // ❌ Problematic - Redux Toolkit approach
   import { useDispatch, useSelector } from 'react-redux';
   const dispatch = useDispatch();
   const data = useSelector(state => state.myFeature.data);
   
   // ✅ Better - Internal hooks with dependency injection
   import { storeHooks } from '../../redux';
   const useMyHook = ({ 
     useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch 
   } = {}) => {
     const dispatch = useAliasDispatch();
     // ...
   };
   ```

18. **Manual promise state management in reducers**:
   ```javascript
   // ❌ Problematic - Manual handling
   const myReducer = (state, action) => {
     switch (action.type) {
       case 'DATA_PENDING':
         return { ...state, loading: true };
       case 'DATA_FULFILLED':
         return { ...state, loading: false, data: action.payload };
       // More boilerplate...
     }
   };
   
   // ✅ Better - Auto-generated with reduxHelpers
   const myReducer = (state, action) => {
     return reduxHelpers.generatedPromiseActionReducer(
       [{ ref: 'data', type: 'GET_DATA' }],
       state,
       action
     );
   };
   ```

19. **Not using multiple selector patterns**:
   ```javascript
   // ❌ Problematic - Multiple individual selectors
   const auth = useSelector(state => state.app.auth);
   const locale = useSelector(state => state.app.locale);
   const errors = useSelector(state => state.app.errors);
   
   // ✅ Better - Combined selector response
   const { data, pending, error } = storeHooks.reactRedux.useSelectorsResponse([
     { id: 'auth', selector: ({ app }) => app?.auth },
     { id: 'locale', selector: ({ app }) => app?.locale },
     { id: 'errors', selector: ({ app }) => app?.errors }
   ]);
   ```

20. **Not leveraging reduxHelpers for state updates**:
   ```javascript
   // ❌ Problematic - Manual state merging
   return {
     ...state,
     myProp: {
       ...state.myProp,
       ...initialState.myProp,
       ...newData
     }
   };
   
   // ✅ Better - Using reduxHelpers.setStateProp
   return reduxHelpers.setStateProp('myProp', newData, {
     state,
     initialState,
     reset: true
   });
   ```

21. **Shallow equality when deep equality is needed**:
   ```javascript
   // ❌ Problematic - Default shallow comparison
   const result = useSelector(mySelector);
   
   // ✅ Better - Deep equality for complex objects
   const result = storeHooks.reactRedux.useSelector(
     mySelector,
     defaultValue,
     { equality: storeHooks.reactRedux.deepEqual }
   );
   ```

## Final Notes

- **Stay consistent** with existing patterns in the codebase
- **Ask questions** when unclear about architecture decisions
- **Test thoroughly** including edge cases and error scenarios
- **Document decisions** especially when deviating from conventions
- **Consider maintainability** when making architectural choices
- **Keep security in mind** especially when handling user data
- **Monitor performance** impact of changes

Remember: The goal is to write code that is readable, maintainable, testable, and performant. When in doubt, prefer simplicity and clarity over cleverness. 
