---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx"]
contexts: ["development", "review", "testing"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["component structure", "dependency injection", "context usage"]
  related_guidelines: ["guidelines/code-style/javascript-react.md", "guidelines/testing/testing-practices.md"]
  importance: "high"
  code_examples: true
---

# Component Architecture Patterns

## Overview

This document provides detailed guidelines for component architecture in the Curiosity Frontend application.

## Component Structure

1. **Single Responsibility Principle** - Each component should have one clear purpose
2. **Composition over inheritance** - Build complex UIs by combining simple components
3. **Container vs Presentational** - Separate data logic from presentation logic

## Component Patterns

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

## Function Dependency Injection Patterns

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

**Advanced Dependency Injection Patterns:**

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

## Context Usage

1. **Use Context sparingly** - Only for truly global state or component trees
2. **Create focused contexts** - Avoid massive context objects
3. **Provide meaningful defaults** - Always include fallback values
