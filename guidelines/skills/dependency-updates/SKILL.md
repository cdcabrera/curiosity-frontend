---
name: dependency-updates
description: Updates NPM dependencies for curiosity-frontend using project scripts (build:deps, build:deps-core), doctor flow, and test:deps verification. Use when bumping packages, Renovate PRs, dependency conflicts, or running filtered updates for PatternFly / Insights / Victory.
---

# Dependency updates

## Scripts (from `package.json`)

| Command | Purpose |
|---------|---------|
| `npm run build:deps` | `dependencies.sh` doctor + update, **excluding** `@patternfly/*`, `@redhat-cloud-services/frontend*`, `victory*` |
| `npm run build:deps-core` | Same doctor flow, **only** those filtered scopes (PatternFly, RHC frontend, Victory) |
| `npm run test:deps` | Runs `test` then `build` to validate after changes |

Read `scripts/dependencies.sh` if behavior or flags are unclear.

## Workflow

1. **Scope** what the user wants: broad deps vs **core** (PF / Insights / Victory). Pick `build:deps` or `build:deps-core` accordingly.
2. **Run** the appropriate script; capture output and failures for the user.
3. **Review** `package.json` / `package-lock.json` diffs; avoid unrelated churn.
4. **Validate** with `npm run test:deps` or at minimum `npm test` and `npm run build:pr_checks` / `verify` per risk (see [agent_testing.md](../../agent_testing.md)).
5. **Hand off** large major bumps (especially PF or FEC) for human review—breaking API changes need visual and integration checks.

## Do not

- Silently widen version ranges or remove lockfile entries to “fix” CI without maintainer direction.
- Mix unrelated dependency upgrades with feature commits unless the user requests a single PR.
