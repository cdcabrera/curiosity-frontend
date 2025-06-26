---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.scss", "*.css"]
contexts: ["development", "review", "file-organization"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["directory structure", "file naming", "component organization", "file organization"]
  related_guidelines: ["guidelines/code-style/javascript-react.md"]
  importance: "high"
  code_examples: true
---

# File Organization

## Overview

This document provides detailed guidelines for file organization in the Curiosity Frontend application.

## Directory Structure

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

## File Naming Conventions

1. **Components** - camelCase for the main file, matching folder name
2. **Utilities** - camelCase descriptive names
3. **Constants** - UPPER_SNAKE_CASE or camelCase
4. **Test files** - `*.test.js` or `*.spec.js`

## Component File Structure

### Standard Component Structure

```
components/
└── MyComponent/
    ├── __tests__/
    │   └── myComponent.test.js
    ├── index.js
    ├── myComponent.js
    └── myComponent.scss
```

### Index File Pattern

Use index files to re-export components and utilities:

```javascript
// components/MyComponent/index.js
export { default, MyComponent } from './myComponent';
```

### Context Component Structure

For components with context:

```
components/
└── MyComponent/
    ├── __tests__/
    │   ├── myComponent.test.js
    │   └── myComponentContext.test.js
    ├── index.js
    ├── myComponent.js
    ├── myComponentContext.js
    └── myComponent.scss
```

## Redux File Organization

```
redux/
├── actions/
│   ├── platformActions.js
│   ├── rhsmActions.js
│   └── userActions.js
├── common/
│   └── reduxHelpers.js
├── hooks/
│   └── useReactRedux.js
├── reducers/
│   ├── appReducer.js
│   ├── graphReducer.js
│   └── inventoryReducer.js
└── types/
    └── index.js
```

## Services File Organization

```
services/
├── common/
│   ├── helpers.js
│   └── serviceConfig.js
├── platform/
│   ├── platformConstants.js
│   ├── platformSchemas.js
│   ├── platformServices.js
│   └── platformTransformers.js
├── rhsm/
│   ├── rhsmConstants.js
│   ├── rhsmHelpers.js
│   ├── rhsmSchemas.js
│   ├── rhsmServices.js
│   └── rhsmTransformers.js
└── user/
    └── userServices.js
```

## Configuration File Organization

```
config/
├── index.js
├── product.ansible.js
├── product.openshiftContainer.js
├── product.openshiftDedicated.js
├── product.openshiftMetrics.js
├── product.rhacm.js
├── product.rhacs.js
├── product.rhel.js
├── product.rhelElsPayg.js
├── product.rhods.js
├── product.rosa.js
├── product.satellite.js
└── products.js
```

## Best Practices for File Organization

1. **Group related files** - Keep files that work together close to each other
2. **Consistent naming** - Use consistent naming patterns across the codebase
3. **Logical hierarchy** - Organize files in a way that reflects their relationships
4. **Avoid deep nesting** - Keep directory structure relatively flat
5. **Separate concerns** - Keep different types of functionality in separate directories
6. **Use index files** - For cleaner imports and exports
7. **Co-locate tests** - Keep tests close to the code they test
