# Product configuration — reference

## Stop conditions

- **OpenShift annual**: The app expects a single OpenShift annual display; if the user asks for another, stop and explain—requires product decision, not a silent code change.
- **Unsupported billing model**: If the variant does not map to an existing pattern after checking `src/config/` and `rhsmConstants.js`, stop and ask for a maintainer or issue reference.

## Interactive questions

Ask **one at a time**; wait for an answer before the next.

1. Product / variant **API id** (kebab-case style as used in repo, e.g. `rhel-for-x86-els-unconverted`).
2. **Full display name** and **short display name** for UI.
3. **Variant class**: PAYG, ON-DEMAND, or ANNUAL (and for annual: RHEL vs OpenShift—OpenShift annual triggers stop condition above unless explicitly overridden by maintainers).
4. For PAYG / on-demand-style flows: **metrics** to show, **capacity** metrics, whether **display names** differ from API metric ids, and optional **description** copy.
5. Confirm any **graph** / **inventory** labeling needs by comparing keys in `public/locales/en-US.json` for similar products (`curiosity-graph`, `curiosity-inventory`, `curiosity-toolbar`, `curiosity-view`).

Do not skip questions unless the user already answered them in the same thread.

## Implementation checklists

### RHEL annual add-on (typical)

- [ ] Variant constant in `src/services/rhsm/rhsmConstants.js` (correct section for the product family).
- [ ] JSDoc / type annotations in that file updated everywhere the pattern requires.
- [ ] Strings in `public/locales/en-US.json` (toolbar, view titles/subtitles/descriptions; extend graph/inventory sections if needed—copy shape from nearest sibling variant).
- [ ] `npm run test:ci` (and snapshot updates only if expected).
- [ ] `npm run test:lint` or `test:lintfix` as appropriate.

Do **not** create a separate product config file **unless** the codebase pattern for that variant family requires it—many annual add-ons extend constants + locales only; confirm via precedent commits.

### OpenShift PAYG / on-demand (typical)

- [ ] Product constant in `src/services/rhsm/rhsmConstants.js` and JSDoc updates (multiple locations as in sibling products).
- [ ] Product module under `src/config/` (e.g. `product.<variant>.js`) following an existing OpenShift product file structure.
- [ ] `public/locales/en-US.json` entries aligned with graph/inventory/toolbar/view keys used by that config.
- [ ] Tests and snapshots updated per `npm run test:ci` / Jest guidance in [agent_testing.md](../../agent_testing.md).

### RHEL PAYG (typical)

- [ ] Constants + JSDoc in `rhsmConstants.js` (variant section).
- [ ] `src/config/product.<variant>.js` (mirror closest RHEL PAYG example).
- [ ] Locales and tests/snapshots as above.

## Localization shape (illustrative)

Match **existing** keys for sibling products; illustrative structure only:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_<id>": "Short name"
  },
  "curiosity-view": {
    "title_<id>": "Full name",
    "subtitle_<id>": "Subtitle",
    "description_<id>": "Description"
  }
}
```

Also check `curiosity-graph` and `curiosity-inventory` for parallel entries when the product uses charts or inventory cards.
