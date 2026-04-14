# Agent Coding

## Overview
Coding standards and architectural patterns for the project.

## For Agents
### Processing Priority
High - Process when implementing features or refactoring code.

### Related Guidelines
See the [Guidelines Index](./README.md#guidelines-index) for all guidelines.

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

## 5. Quality Control & Validation
Agents MUST validate all code outputs using the project's quality suite:

1. **Linting**: `npm run test:lint` (Ensures style consistency)
2. **Documentation**: `npm run test:spell` and `npm run test:spell-support` (CSpell validation)
3. **Testing**: `npm run test` (Unit) and `npm run test:integration` (E2E)
4. **Build**: `npm run build` (Webpack compilation and bundling and integration testing)
5. **Build Integration Testing**: `npm run build` Ensure all tests pass and no snapshot errors are present before committing. If errors persist run `npm run test:integration-dev` to enter Jest watch mode and update snapshots.
