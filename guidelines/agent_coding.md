# Agent Coding

## Overview
Coding standards and architectural patterns for curiosity-frontend.

## For Agents
### Processing Priority
High - Process when implementing features or refactoring code.

## 1. Stack and Architecture
- **React**: Mirror functional component and hook patterns used in neighboring files.
- **UI**: Use `@patternfly/react-*` and tokens; align with existing shared components.
- **Types**: Match the existing language (JS or TS) and JSDoc style of the directory.

## 2. Module Organization
- **Imports**: Group external (PF/React), then internal (`services/`, `redux/`), then relative.
- **Components**: Follow `src/components/<Name>/` with `__tests__`, `index.js`, and local styles.
- **Config**: Use `src/config/` for products and `src/services/rhsm/` for constants.

## 3. Redux and State
- **Custom Surface**: Import **`storeHooks`** from `src/redux`. Use `storeHooks.reactRedux` helpers (e.g., `useDispatch`, `useSelector`).
- **Patterns**: Use `reduxHelpers` and existing reducer/action patterns. Review `src/redux/index.js` before adding new state.

## 4. Implementation Details
- **Testability**: Use dependency injection via default parameters (e.g., `useX = defaultX`).
- **I18n**: User-visible strings must use `public/locales/en-US.json` via i18n helpers.
- **Linting**: Run `npm run test:lint` and `npm run test:lintfix` before completion.
