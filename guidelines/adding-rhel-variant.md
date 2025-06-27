---
title: "Adding RHEL Variants"
priority: 3
context: ["rhel", "product-config", "variants", "localization"]
tags: ["rhel", "product", "variant", "constants", "i18n", "testing"]
last_updated: "2025-01-26"
effectiveness_tracking:
  usage_count: 0
  success_rate: 0
  avg_completion_time: 0
  user_feedback: []
version_compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
  breaking_changes: []
  deprecated_features: []
---

# Adding RHEL Variants

This guide provides step-by-step instructions for adding new RHEL product variants to the curiosity-frontend application.

## Overview

RHEL variants are different editions or configurations of Red Hat Enterprise Linux that require separate tracking and reporting in the Curiosity application. Examples include RHEL for ARM, RHEL for IBM Power, RHEL for x86, etc.

## Prerequisites

- Basic understanding of the project structure
- Access to modify configuration files
- Understanding of internationalization (i18n) patterns
- Knowledge of Jest testing framework

## Step-by-Step Process

### 1. Add Variant to Constants

**File:** `src/services/rhsm/rhsmConstants.js`

Add the new variant to the `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES` object:

```javascript
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  RHEL_ARM: 'RHEL for ARM',
  RHEL_AUS_ADDON: 'rhel-aus-addon',
  RHEL_BALLS: 'rhelballs',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_LOREM_IPSUM: 'rhelLoremIpsum',  // ← New variant
  RHEL_X86: 'RHEL for x86',
  // ... other variants
};
```

**Key Points:**
- Use a descriptive constant name (e.g., `RHEL_LOREM_IPSUM`)
- The value should be the product ID used by the API
- Insert alphabetically to maintain order
- Follow existing naming conventions

### 2. Update JSDoc Annotations

**File:** `src/services/rhsm/rhsmConstants.js`

Update the JSDoc type annotations in **three locations**:

1. **RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES type annotation** (around line 8-11)
2. **RHSM_API_PATH_PRODUCT_TYPES type annotation** (around line 47-53)  
3. **Main rhsmConstants JSDoc** (around line 470+) - appears in two places in the massive type definition

Add `RHEL_[VARIANT]: string` to each type definition, maintaining alphabetical order.

**Example:**
```javascript
/**
 * @type {{RHEL_ARM: string, RHEL_AUS_ADDON: string, RHEL_BALLS: string, RHEL_IBM_Z: string, RHEL_LOREM_IPSUM: string, RHEL_X86: string, ...}}
 */
```

### 3. Add Localization Entries

**File:** `public/locales/en-US.json`

Add entries in the `curiosity-toolbar` and `curiosity-view` sections:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_[product-id]": "[Short Title]"
  },
  "curiosity-view": {
    "title_[product-id]": "[Full Title]",
    "subtitle_[product-id]": "$t(curiosity-view.subtitle_RHEL)",
    "description_[product-id]": "$t(curiosity-view.description_RHEL)"
  },
  "curiosity-graph": {
    "legendTooltip_Sockets_hypervisor_[product-id]": "$t(curiosity-graph.legendTooltip_Sockets_hypervisor_RHEL)"
  }
}
```

**Example for rhelLoremIpsum:**
```json
{
  "curiosity-toolbar": {
    "label_groupVariant_rhelLoremIpsum": "RHEL Lorem Ipsum Dolor Sit"
  },
  "curiosity-view": {
    "title_rhelLoremIpsum": "Red Hat Enterprise Linux Lorem Ipsum Dolor Sit",
    "subtitle_rhelLoremIpsum": "$t(curiosity-view.subtitle_RHEL)",
    "description_rhelLoremIpsum": "$t(curiosity-view.description_RHEL)"
  },
  "curiosity-graph": {
    "legendTooltip_Sockets_hypervisor_rhelLoremIpsum": "$t(curiosity-graph.legendTooltip_Sockets_hypervisor_RHEL)"
  }
}
```

### 4. Update Jest Snapshots

After making the constants changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

This will update snapshots in:
- `src/services/rhsm/__tests__/__snapshots__/rhsmConstants.test.js.snap`

### 5. Run ESLint Fix

Apply code formatting and linting fixes:

```bash
npx eslint --fix src/services/rhsm/rhsmConstants.js
```

**Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes, such as:
- Converting line comments (`//`) to block comments (`/* */`) 
- Modifying unrelated code sections
- Changes to parts of the file not related to your variant addition

**Focus only on changes directly related to the new variant.**

### 6. Validate Changes

Run the specific test to ensure everything works:

```bash
npm run test:ci -- --testPathPattern=rhsmConstants.test.js
```

## Naming Conventions

### Constant Names
- Format: `RHEL_[DESCRIPTIVE_NAME]`
- Use uppercase with underscores
- Be descriptive but concise
- Examples: `RHEL_ARM`, `RHEL_IBM_POWER`, `RHEL_LOREM_IPSUM`

### Product IDs (API Values)
- Use lowercase with hyphens or descriptive names
- Match what the backend API expects
- Examples: `'RHEL for ARM'`, `'rhel-aus-addon'`, `'rhelLoremIpsum'`

### Localization Keys
- **Toolbar labels:** `label_groupVariant_[product-id]`
- **View titles:** `title_[product-id]`
- **View subtitles:** `subtitle_[product-id]`
- **View descriptions:** `description_[product-id]`
- **Graph legends:** `legendTooltip_Sockets_hypervisor_[product-id]`

### Display Names
- **Short Title:** Used in toolbars and compact displays (e.g., "RHEL Lorem Ipsum Dolor Sit")
- **Full Title:** Used in page headers and detailed views (e.g., "Red Hat Enterprise Linux Lorem Ipsum Dolor Sit")

## File Checklist

- [ ] `src/services/rhsm/rhsmConstants.js` - Add constant and update JSDoc
- [ ] `public/locales/en-US.json` - Add localization entries
- [ ] Run `npm run test:ci -- --updateSnapshot` - Update snapshots
- [ ] Run `npx eslint --fix src/services/rhsm/rhsmConstants.js` - Format code
- [ ] Run tests to validate changes

## Common Pitfalls

### ❌ Don't Do This
- Don't modify unrelated code when updating JSDoc annotations
- Don't forget to update all three JSDoc type definitions
- Don't skip the localization entries
- Don't forget to update snapshots after constants changes
- Don't use inconsistent naming patterns

### ✅ Do This
- Focus only on changes directly related to the new variant
- Update JSDoc annotations in all required locations
- Follow existing naming conventions consistently
- Add complete localization coverage
- Run all validation steps

## Integration Points

The new variant will automatically be available in:

1. **Product Configuration:** Via `src/config/product.rhel.js` through the `productVariants` array
2. **Toolbar Filtering:** Through the variant dropdown in graph toolbars
3. **API Requests:** As valid product variant parameters
4. **Localization:** Proper display names throughout the UI

## Testing Strategy

### Automated Tests
- Constants tests will validate the new variant exists
- Snapshot tests will capture the structural changes
- Integration tests will verify the variant appears in UI components

### Manual Testing
1. Check that the new variant appears in product variant dropdowns
2. Verify proper display names are shown
3. Confirm API requests include the new variant when selected
4. Test that localization works for all supported languages

## Example Implementation

Reference the `rhelLoremIpsum` variant implementation as a complete example:

```javascript
// Constants
RHEL_LOREM_IPSUM: 'rhelLoremIpsum',

// Localization
"label_groupVariant_rhelLoremIpsum": "RHEL Lorem Ipsum Dolor Sit",
"title_rhelLoremIpsum": "Red Hat Enterprise Linux Lorem Ipsum Dolor Sit",
"subtitle_rhelLoremIpsum": "$t(curiosity-view.subtitle_RHEL)",
"description_rhelLoremIpsum": "$t(curiosity-view.description_RHEL)",
"legendTooltip_Sockets_hypervisor_rhelLoremIpsum": "$t(curiosity-graph.legendTooltip_Sockets_hypervisor_RHEL)"
```

## Related Documentation

- [RHEL Product Configuration](../src/config/product.rhel.js)
- [RHSM Constants](../src/services/rhsm/rhsmConstants.js)
- [Internationalization Guide](./development.md#internationalization)
- [Testing Guidelines](./testing.md)

---

*This guideline is part of the context-specific documentation system. It should be used when working with RHEL product variants in the curiosity-frontend application.* 