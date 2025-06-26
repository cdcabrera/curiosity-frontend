---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.scss", "*.css"]
contexts: ["development", "review", "code-style"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["javascript", "react", "code style", "import patterns", "export patterns", "function dependency injection"]
  related_guidelines: ["guidelines/component-architecture/component-patterns.md"]
  importance: "high"
  code_examples: true
---

# JavaScript/React Code Style Guidelines

## Overview

This document provides detailed guidelines for JavaScript and React code style in the Curiosity Frontend application.

## JavaScript/React

1. **Use functional components** with hooks rather than class components
2. **Future React Compatibility**:
   - Use **default parameters** instead of `defaultProps` (which is deprecated in newer React versions)
   - Use **JSDoc comments** instead of `PropTypes` for type documentation
3. **Defensive programming practices** (project best practices):
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

// Use meaningful prop destructuring with default parameters (future React compatible)
const MyComponent = ({ title, onSave, isDisabled = false }) => {
  // Component logic
};
```

## CSS/SCSS

1. **Use BEM methodology** for CSS class naming
2. **Follow existing SCSS structure** and variables
3. **Prefer CSS modules or styled-components** when available
4. **Use semantic class names** that describe purpose, not appearance

## Function Dependency Parameter Injection

**Pattern**: Pass dependencies as parameters to functions rather than importing them directly
  - Use an options object with default values for all dependencies
  - Alias dependencies with descriptive names to avoid naming conflicts
  - Make all dependencies optional by providing default values

**Benefits**:
  - Improves testability by making it easy to mock dependencies
  - Increases flexibility by allowing consumers to override dependencies
  - Makes dependencies explicit in function signatures

**Example**:
```javascript
// Recommended approach
const useMyHook = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();

  // Hook implementation...
};

// Avoid direct imports that can't be easily mocked
// import { useDispatch } from 'react-redux';
// const useMyHook = () => {
//   const dispatch = useDispatch();
//   // ...
// };
```
