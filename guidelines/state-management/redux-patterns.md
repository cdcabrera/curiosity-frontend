---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx"]
contexts: ["development", "review", "state-management", "redux"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["redux", "state management", "selectors", "reducers", "actions", "hooks"]
  related_guidelines: ["guidelines/code-style/javascript-react.md", "guidelines/component-architecture/component-patterns.md"]
  importance: "high"
  code_examples: true
---

# State Management Patterns

## Overview

This document provides detailed guidelines for state management in the Curiosity Frontend application, focusing on the project's custom Redux architecture.

## Project-Specific Redux Architecture

While Redux Toolkit is the officially recommended approach for most Redux applications, this codebase uses a custom internal Redux architecture with specialized hooks and helpers. **For consistency with the existing codebase, use these internal utilities:**

### 1. Internal Hooks (storeHooks.reactRedux)

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

// For this project, avoid direct Redux/React-Redux hooks
import { useDispatch, useSelector } from 'react-redux';
```

### 2. Advanced Selector Patterns

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

### 3. Generated Promise Action Reducers

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

### 4. Internal Redux Helpers

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

### 5. Custom Selector Creation

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

### 6. Multi-Action Dispatch Patterns

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

## Key Benefits of Internal Redux Architecture

1. **Promise-like State Management** - Built-in pending/fulfilled/error states
2. **Automatic Reducer Generation** - Less boilerplate than Redux Toolkit
3. **Advanced Selector Composition** - Multiple Promise patterns (all, race, any)
4. **Deep Equality Memoization** - Better performance for complex objects when combined with service response caching
5. **Dependency Injection** - Highly testable and modular
6. **Built-in Response Normalization** - Automatic API response handling

## Local State vs Global State

1. **Local state first** - Use `useState` for component-specific state
2. **Lift state up** only when multiple components need the same data
3. **Global state** for truly application-wide state (user, auth, etc.)

## Project-Specific Redux Patterns

### Using project's internal hooks for consistency

```javascript
// Not aligned with project patterns - Standard Redux/React-Redux approach
import { useDispatch, useSelector } from 'react-redux';
const dispatch = useDispatch();
const data = useSelector(state => state.myFeature.data);

// Preferred for this project - Internal hooks with dependency injection
import { storeHooks } from '../../redux';
const useMyHook = ({ 
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch 
} = {}) => {
  const dispatch = useAliasDispatch();
  // ...
};
```

### Manual promise state management in reducers

```javascript
// Not recommended for this project - Manual promise state handling
const myReducer = (state, action) => {
  switch (action.type) {
    case 'DATA_PENDING':
      return { ...state, loading: true };
    case 'DATA_FULFILLED':
      return { ...state, loading: false, data: action.payload };
    // More boilerplate...
  }
};

// Preferred for this project - Auto-generated with reduxHelpers
const myReducer = (state, action) => {
  return reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'data', type: 'GET_DATA' }],
    state,
    action
  );
};
```

### Not using multiple selector patterns

```javascript
// Standard approach - Multiple individual selectors
const auth = useSelector(state => state.app.auth);
const locale = useSelector(state => state.app.locale);
const errors = useSelector(state => state.app.errors);

// Preferred for this project - Combined selector response
const { data, pending, error } = storeHooks.reactRedux.useSelectorsResponse([
  { id: 'auth', selector: ({ app }) => app?.auth },
  { id: 'locale', selector: ({ app }) => app?.locale },
  { id: 'errors', selector: ({ app }) => app?.errors }
]);
```

### Not leveraging reduxHelpers for state updates

```javascript
// Common approach - Manual state merging
return {
  ...state,
  myProp: {
    ...state.myProp,
    ...initialState.myProp,
    ...newData
  }
};

// Preferred for this project - Using reduxHelpers.setStateProp
return reduxHelpers.setStateProp('myProp', newData, {
  state,
  initialState,
  reset: true
});
```

### Shallow equality when deep equality is needed

```javascript
// Standard approach - Default shallow comparison
const result = useSelector(mySelector);

// Preferred for this project - Deep equality for complex objects
const result = storeHooks.reactRedux.useSelector(
  mySelector,
  defaultValue,
  { equality: storeHooks.reactRedux.deepEqual }
);
```
