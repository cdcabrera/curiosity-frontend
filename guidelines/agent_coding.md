# Agent Coding

Agent-only coding guidance for curiosity-frontend. Maintainer detail lives in [CONTRIBUTING.md](../CONTRIBUTING.md); this file captures expectations agents should apply consistently.

## Stack

- **React** — Functional components and hooks. Prefer patterns already used in neighboring files.
- **PatternFly** — `@patternfly/react-*` and tokens; align with existing components.
- **Red Hat Insights / FEC** — Build and host constraints per [README.md](../README.md) and `CONTRIBUTING.md`.
- **JavaScript and TypeScript** — Match the language of the files you edit; follow existing JSDoc and module style in that directory.

## Imports

Typical order (match local convention):

1. External libraries (e.g. React, PatternFly, lodash).
2. Internal packages from `redux`, `services`, `common`, `config`, etc.
3. Relative imports (components, hooks, local utilities).

Use aliases for long constant names when the codebase already does. Avoid unnecessary churn to import ordering beyond project ESLint rules.

## Components

- Prefer **composition** and **single responsibility**; mirror structure of similar features.
- **Testability** — Use dependency injection via **default parameters** for hooks and functions you need to mock in tests (see existing `useX: useAliasX = useX` patterns in contexts and views).
- **Callbacks** — Use explicit checks such as `typeof fn === 'function'` before invoking when that matches surrounding code.

## Redux

This project uses a **custom Redux surface** exported from `src/redux`:

- Import **`storeHooks`** from `../../redux` (or the appropriate relative path) and use **`storeHooks.reactRedux`** helpers (e.g. `useDispatch`, `useSelector`, `useSelectorsResponse`) as in neighboring modules.
- Use **`reduxHelpers`** and existing reducer/action patterns; do not introduce ad hoc global state or bypass established action types without an explicit migration.

When unsure, read **`src/redux/index.js`** and a similar feature’s container/context before adding new Redux usage.

## Layout and naming

- **Components** — `src/components/<ComponentName>/` with `__tests__/`, main module, optional `index.js`, styles as used locally.
- **Config** — Product and variant configuration under `src/config/`; RHSM constants and API-related constants under `src/services/rhsm/` (e.g. `rhsmConstants.js`) where applicable.
- **Tests** — Colocate under `__tests__/` next to the code under test; see [agent_testing](./agent_testing.md).

## Localization

- User-visible strings go through the project’s i18n helpers; update **`public/locales/en-US.json`** (and related locale rules) when adding or changing copy. Follow `CONTRIBUTING.md` for locale and spelling checks.

## Git and commits

- Follow [CONTRIBUTING.md](../CONTRIBUTING.md) for conventional commits, scopes, and issue references (e.g. `sw-####`).

## Linting

- Run **`npm run test:lint`** (and **`npm run test:lintfix`** where appropriate for `src`) before considering work complete. Do not disable ESLint rules broadly unless the user explicitly requests it and maintainers agree.
