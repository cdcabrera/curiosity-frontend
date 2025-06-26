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
   - Prefer TypeScript when possible for better type safety
3. **Defensive programming practices** (from cabrera.code/ccabrera):
   - Always use `typeof callback === 'function'` instead of just `if (callback)`
   - Implement proper type checking before function calls
   - Use optional chaining (`?.`) when appropriate
4. **Follow naming conventions**:
   - Components: PascalCase (`MyComponent`)
   - Files: camelCase matching component name (`inventoryCard.js`, `graphCardHelpers.js`)
   - Variables and functions: camelCase (`myVariable`, `myFunction`)
   - Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)

4. **Import organization**:
   ```javascript
   // External libraries first
   import React from 'react';
   import { useSelector } from 'react-redux';
   
   // Internal imports second
   import { myHelper } from '../helpers/myHelper';
   import MyComponent from './MyComponent';
   
   // Relative imports last
   import './myComponent.scss';
   ```

5. **Destructuring preferences**:
   ```javascript
   // Prefer destructuring
   const { loading, error, data } = useSelector(state => state.myReducer);
   
   // Use meaningful prop destructuring with default parameters (React 19 ready)
   const MyComponent = ({ title, onSave, isDisabled = false }) => {
     // Component logic
   };
   ```

6. **Component prop documentation** (React 19 ready):
   ```javascript
   /**
    * MyComponent description
    * @param {Object} props - Component props
    * @param {string} props.title - The component title
    * @param {Function} [props.onSave] - Save callback function
    * @param {boolean} [props.isDisabled=false] - Whether component is disabled
    */
   const MyComponent = ({ title, onSave, isDisabled = false }) => {
     // Component implementation
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
 * @param {Object} props - Component props
 * @param {string} props.prop1 - Required string prop
 * @param {number} [props.prop2] - Optional number prop
 * @param {Function} [props.onAction] - Optional callback function
 * @param {Object} [props.otherProps] - Additional props to spread
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
  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  
  // Main render
  return (
    <div className="my-component" {...otherProps}>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### Context Usage

1. **Use Context sparingly** - Only for truly global state or component trees
2. **Create focused contexts** - Avoid massive context objects
3. **Provide meaningful defaults** - Always include fallback values

## State Management

### Redux Patterns

1. **Normalize state shape** - Avoid deeply nested objects
2. **Use Redux Toolkit** when available for reducers and actions
3. **Keep reducers pure** - No side effects in reducers
4. **Use selectors** - Create reusable state selectors

```javascript
// Reducer example
const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { 
        ...state, 
        data: action.payload, 
        loading: false, 
        error: null 
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    default:
      return state;
  }
};

// Selector example
const selectMyData = (state) => state.myFeature.data;
const selectIsLoading = (state) => state.myFeature.loading;
```

### Local State vs Global State

1. **Local state first** - Use `useState` for component-specific state
2. **Lift state up** only when multiple components need the same data
3. **Global state** for truly application-wide state (user, auth, etc.)

## Testing Practices

### Unit Testing

1. **Test behavior, not implementation** - Focus on what the component does
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

1. **Components** - PascalCase for the main file, matching folder name
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
2. **Linting and formatting** - Run on pre-commit hooks
3. **Type checking** - Use TypeScript or JSDoc comments (React 19 ready)
4. **Bundle analysis** - Regularly check bundle size

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

## Additional Pitfalls from cabrera.code/ccabrera Analysis

9. **Insufficient function validation**:
   ```javascript
   // Problematic - No type checking
   if (callback) {
     callback();
   }
   
   // Better - Proper type validation
   if (typeof callback === 'function') {
     callback();
   }
   ```

10. **Fragmented test files** - Consolidate similar tests instead of creating many small test files

11. **Inconsistent component context patterns** - Always create context files for complex state management

12. **Missing issue tracking in commits** - Always include JIRA issue numbers in commit messages

13. **Incomplete migration patterns** - When refactoring, update all related files (tests, snapshots, dependencies) in the same commit

14. **Shallow equality checks in hooks** - Prefer deep equality for complex objects (useReactRedux pattern)

## Final Notes

- **Stay consistent** with existing patterns in the codebase
- **Ask questions** when unclear about architecture decisions
- **Test thoroughly** including edge cases and error scenarios
- **Document decisions** especially when deviating from conventions
- **Consider maintainability** when making architectural choices
- **Keep security in mind** especially when handling user data
- **Monitor performance** impact of changes

Remember: The goal is to write code that is readable, maintainable, testable, and performant. When in doubt, prefer simplicity and clarity over cleverness. 