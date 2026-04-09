---
name: curiosity-architecture-patterns
description: Aligns new or refactored UI and state code with curiosity-frontend conventions—storeHooks-based Redux, component folders, dependency injection for tests, import order, and ESLint. Use when adding a component, refactoring a view, wiring Redux, fixing eslint, matching repo architecture, or mirroring an existing feature’s structure.
---

# Curiosity architecture and style

## Before editing

1. Read [agent_coding.md](../../agent_coding.md) for norms; this skill is the **task workflow**, not a duplicate of that reference.
2. Open **two or three neighboring files** in the same feature area (same directory or parent feature) and mirror their structure.

## Workflow

1. **Redux**
   - Import `storeHooks` from `redux` (see `src/redux/index.js`).
   - Use `storeHooks.reactRedux` (`useDispatch`, `useSelector`, `useSelectorsResponse`, etc.) the same way sibling files do—avoid introducing raw `react-redux` hooks unless the codebase already does in that layer.
   - Use `reduxHelpers` / existing action and reducer patterns; do not add parallel global state without maintainer direction.

2. **Components**
   - Place UI under `src/components/<Name>/` with colocated `__tests__/` and optional `index.js`, matching siblings.
   - Expose injectable hooks/helpers via **default parameters** (`useFoo: useAliasFoo = useFoo`) so tests can substitute mocks.

3. **Imports**
   - Order: external → internal (`redux`, `services`, `common`, `config`) → relative. Keep long constants aliased like neighboring files.

4. **PatternFly**
   - Use installed `@patternfly/*` versions from `package.json`; match existing component usage—use PatternFly MCP or docs when unsure of API, but **repo patterns win** over generic examples.

5. **i18n**
   - User-visible strings through existing i18n helpers; update `public/locales/en-US.json` when copy changes (see [product-configuration](../product-configuration/SKILL.md) for product-specific keys).

6. **Validate**
   - `npm run test:lint` — required.
   - `npm run test:lintfix` for autofixable issues in `src` (JS/JSX/JSON per script scope).
   - Do not blanket-disable ESLint rules; narrow overrides only if the user and maintainers expect them.

## Checklist

Copy and track when finishing a change:

```
- [ ] Neighbor file(s) reviewed for structure and hooks
- [ ] storeHooks / reduxHelpers patterns preserved
- [ ] Tests colocated; DI defaults for mockable hooks
- [ ] Imports and i18n consistent with feature
- [ ] npm run test:lint passes
```

## Extra detail

- Expanded checklist and anti-patterns: [reference.md](reference.md)
