# Agent Testing

Agent-only testing guidance. Full maintainer documentation is in [CONTRIBUTING.md](../CONTRIBUTING.md#testing); this file lists commands and expectations agents should run and respect.

## Principles

- Test **behavior and user-visible outcomes**, not implementation details, unless the project already tests internals in that module.
- Prefer **React Testing Library** queries that reflect how users interact (roles, labels); use `data-testid` only where the codebase already does for stable selection.
- Follow **Arrange, Act, Assert** and clear test names.
- **Mock** external services and network boundaries; inject test doubles via the same dependency-injection patterns used in components (see [agent_coding](./agent_coding.md)).

## Where tests live

- **Unit tests** — Under `__tests__/` directories alongside `src` code (e.g. `src/components/MyComponent/__tests__/`).
- **Integration tests** — `tests/` at the repository root (`jest ./tests`).

## Commands

| Intent | Command |
|--------|---------|
| Watch unit tests while developing | `npm run test:dev` |
| Full unit pipeline (spell, lint, Jest coverage) | `npm test` |
| CI-style unit run | `npm run test:ci` |
| Ephemeral / UTC parity for unit tests | `npm run test:ephemeral` |
| Lint only | `npm run test:lint` |
| Autofix lint for `src` (JS/JSX/JSON) | `npm run test:lintfix` |
| Spell check (locales + `src` JS) | `npm run test:spell` |
| Integration tests | `npm run test:integration` |
| Integration (ephemeral profile) | `npm run test:integration-ephemeral` |
| Clear Jest cache | `npm run test:clearCache` |
| PR-style verification | `npm run verify` |

Spell and lint configurations are defined under `config/`; see `CONTRIBUTING.md` for CI expectations (GitHub Actions, Jenkins).

## Snapshots

- Update snapshots **only** when output changes are intentional. Use Jest’s update flow (e.g. `npm run test:dev` and press `u`, or targeted `--updateSnapshot`) scoped to the tests you own.
- Never bulk-refresh snapshots to silence failures without reviewing each diff.

## Definition of done

Before handing off a change that touches application code:

1. **`npm run test:lint`** passes (and autofix if appropriate).
2. **`npm test`** or at least **`npm run test:ci`** passes for the affected area when feasible.
3. Snapshot updates, if any, are reviewed and explained.

For release-sensitive or wide refactors, prefer **`npm run verify`** when the user expects PR parity.
