# Agent Testing

## Overview
Testing procedures and standards for agents in curiosity-frontend.

## For Agents
### Processing Priority
High - Process when writing tests or verifying changes.

## 1. Principles
- **Focus on Behavior**: Test user-visible outcomes using React Testing Library (roles, labels).
- **Mocking**: Isolate external services. Use dependency injection for test doubles.
- **Structure**: Unit tests in `__tests__/` parallel to source; integration tests in `tests/`.

## 2. Command Reference
 Intent | Command                                                                                                                                             |
:-------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
 **Develop** | `npm run test:dev` (Watch mode), `npm run build` (Compile and run integration tests), `npm run test:integration-dev` (Watch mode for build compile) |
 **Pipeline** | `npm test` (Lints, spells, unit tests)                                                                                                              |
 **CI / Done** | `npm run build`                                                                                                                                     |
 **Lint** | `npm run test:lint` / `npm run test:lintfix`                                                                                                        |
 **Spelling** | `npm run test:spell` (locale strings and code), `npm run test:spell-support` (for `docs/` and `guidelines/`)                                        |

## 3. Snapshots
- **Intentionality**: Update snapshots **only** for expected output changes.
- **Workflow**: Use `npm run test:dev` and press `u` for targeted updates. Inspect all diffs.

## 4. Definition of Done
1. **Linting**: `npm run test:lint` passes.
2. **Verification**: `npm run test:ci` (or `npm test`) passes for the affected area.
3. **Handoff**: Summarize verification steps and justify snapshot updates.
