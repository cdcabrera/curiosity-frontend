# Curiosity architecture — reference

## Anti-patterns

- Importing `useDispatch` / `useSelector` directly from `react-redux` in files that otherwise use `storeHooks`—breaks consistency and tests that expect the project hook surface.
- New Redux state or action type namespaces that do not follow existing `redux/types`, `redux/actions`, and reducer layout without a planned migration.
- Adding components at the wrong tier (e.g. feature-specific UI dumped under `common/` when siblings live under `components/<Feature>/`).
- Disabling an ESLint rule file-wide to silence a single line—prefer a minimal inline exception with a short comment only if maintainers allow it.

## Where to look

| Need | Start here |
|------|------------|
| Redux exports | `src/redux/index.js` |
| Hook implementations | `src/redux/hooks/` |
| Example context + selectors | `src/components/productView/`, `src/components/bannerMessages/` |
| Product constants | `src/services/rhsm/rhsmConstants.js` |
| Product modules | `src/config/product.*.js` |

## Tests

Follow [agent_testing.md](../../agent_testing.md): colocate under `__tests__/`, inject hooks via props/default params, run `npm test` or `npm run test:ci` before handoff.
