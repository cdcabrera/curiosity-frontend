---
name: product-configuration
description: Adds or updates subscription product variants (PAYG, on-demand, annual RHEL paths) in curiosity-frontend—rhsmConstants, product config modules, locales, tests. Use when the user asks to add a product variant, PAYG/on-demand/annual subscription UI, update rhsmConstants, or wire a new product config under src/config.
---

# Product configuration

## Preconditions

- Follow [agent_behaviors.md](../../agent_behaviors.md) and [agent_coding.md](../../agent_coding.md). Repo rules override generic PatternFly or external examples.
- Use **current** code and **git history** for precedents; do not trust example commit hashes from old docs without verifying with `git log` / `git show`.

## Workflow

1. **Classify** the variant with the user (annual RHEL add-on vs OpenShift PAYG vs RHEL PAYG vs on-demand, etc.). If the app does not support the case (e.g. duplicate OpenShift annual), **stop** and explain—see [reference.md](reference.md#stop-conditions).
2. **Gather** required fields using the **sequential** question list in [reference.md](reference.md#interactive-questions)—one question at a time, no invented IDs or metrics.
3. **Find precedents**: `git log --oneline -- src/services/rhsm/rhsmConstants.js` and similar paths for the closest existing variant; mirror structure.
4. **Apply** the checklist for that path in [reference.md](reference.md#implementation-checklists).
5. **Validate**: `npm run test:lintfix` (or `npm run test:lint`), `npm run test:ci`; update snapshots only when changes are intentional (see [agent_testing.md](../../agent_testing.md)).
6. **Handoff**: List anything only a human can verify (APIs, entitlements, stage). Ask whether the user confirms success before treating the task as closed.

## Do not

- Add partial configs or skip `public/locales/en-US.json` keys used by the new variant.
- Introduce a new top-level config pattern without matching neighboring products under `src/config/`.

## Additional detail

- Question scripts, localization shape, and per-path checklists: [reference.md](reference.md)
