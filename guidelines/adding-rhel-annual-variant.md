---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "config/*.js", "*.json"]
contexts: ["development", "product-config"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "sequential"
  validation_required: true
  key_concepts: ["rhel", "annual-variant", "product-config", "rhel-variant", "els", "eus", "aus"]
  related_guidelines: ["guidelines/adding-openshift-product.md", "guidelines/adding-rhel-payg-variant.md"]
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding a RHEL annual variant"
  trigger_prefixes: ["/workflow add rhel"]
---

# Adding RHEL Annual Variants

This guide provides step-by-step instructions for adding new RHEL annual variant configurations to the curiosity-frontend application.

## Overview

RHEL annual variants in this application include add-ons like Extended Update Support (EUS), Extended Life Support (ELS), Advanced Update Support (AUS), and other specialized configurations. These variants typically use standard RHEL metrics and follow consistent naming patterns.

## Interactive Configuration Process

You MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product ID for the variant?"** - The API identifier for the variant
   - Examples: `RHEL for x86`, `rhel-for-x86-eus`, `rhel-aus-addon`
   - Standard variants use format: `RHEL for [Purpose]`
   - Special variants use format: `rhel-for-[purpose]-[type]` or similar kebab-case

2. **"What is the product variant complete long, or full, name?"** - The complete display name
   - Examples: `Red Hat Enterprise Linux for x86`, `Red Hat Enterprise Linux Extended Life Cycle Support Add-On, Annual`
   - Standard variants use format: `Red Hat Enterprise Linux for [Purpose]`
   - Add-ons use more descriptive naming with appropriate suffixes

3. **"What is the product variant short name?"** - The abbreviated display name
   - Examples: `RHEL for x86`, `RHEL for x86 EUS`, `RHEL AUS Add-On, Annual`
   - Should be human-readable and follow existing naming patterns
   - Used in UI menus and filters

**IMPORTANT:**
- DO NOT proceed with implementation until all questions are answered and validated
- DO NOT assume any values; always ask for explicit confirmation
- Each question MUST be asked separately, waiting for a response before proceeding
- Do NOT skip any questions unless explicitly requested
- Exit the process if the user requests to stop

## Step-by-Step Implementation

### Step 1: Add Variant to Constants

Add the new variant to the `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES` object in `src/services/rhsm/rhsmConstants.js` in alphabetical order:

```javascript
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  RHEL_ARM: 'RHEL for ARM',
  RHEL_AUS_ADDON: 'rhel-aus-addon',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  RHEL_X86_ELS_UNCONVERTED: 'rhel-for-x86-els-unconverted',  // <-- Similar to your new variant
  RHEL_X86_EUS: 'rhel-for-x86-eus',
  RHEL_X86_HA: 'rhel-for-x86-ha',
  RHEL_X86_RS: 'rhel-for-x86-rs',
  RHEL_X86_SAP: 'rhel-for-x86-sap',
  // ... Add your variant here in alphabetical order
};
```

**Requirements:**
- Use UPPER_SNAKE_CASE for the constant name (e.g., `RHEL_X86_EUS`)
- Use the exact API identifier for the value (typically kebab-case for variants)
- Maintain alphabetical ordering within the object
- Follow the existing naming pattern for similar variant types

### Step 2: Update JSDoc Type Annotations

Update all JSDoc type annotations in `rhsmConstants.js` to include the new variant. You need to modify **at least 3 locations**:

**Location 1: RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES type annotation**
```javascript
/**
 * RHSM path IDs for product RHEL variants.
 *
 * @type {{RHEL_ARM: string, RHEL_X86_RS: string, RHEL_X86_ELS_UNCONVERTED: string, RHEL_X86_EUS: string,
 *     RHEL_X86_HA: string, RHEL_X86_SAP: string, RHEL_AUS_ADDON: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string,
 *     RHEL_X86: string, YOUR_NEW_VARIANT: string}}
 */
```

**Location 2: RHSM_API_PATH_PRODUCT_TYPES type annotation**
This appears within the constants file where all product types are combined.

**Location 3-4: Main rhsmConstants JSDoc**
Search for large JSDoc blocks that list all product types (typically around line 470+) and add your variant in alphabetical order. These appear in multiple places in the large type definition.

**Requirements:**
- Add your variant to ALL JSDoc annotations that list RHEL variants
- Maintain alphabetical order in each annotation
- Keep consistent formatting with existing annotations

### Step 3: Add Localization Entries

Add the necessary translation entries to `public/locales/en-US.json` for your new variant:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_your-variant-id": "Your RHEL Variant Short Name"
  },
  "curiosity-view": {
    "title_your-variant-id": "Your RHEL Variant Full Name",
    "subtitle_your-variant-id": "$t(curiosity-view.subtitle_RHEL)",
    "description_your-variant-id": "$t(curiosity-view.description_RHEL)"
  }
}
```

For RHEL variants, you'll also need to add entries to the following sections if they don't already inherit from base RHEL configurations:

```json
{
  "curiosity-graph": {
    "legendTooltip_Sockets_hypervisor_your-variant-id": "$t(curiosity-graph.legendTooltip_Sockets_hypervisor_RHEL)",
    "legendTooltip_Sockets_physical_your-variant-id": "$t(curiosity-graph.legendTooltip_Sockets_physical_RHEL)",
    "legendTooltip_Sockets_virtual_your-variant-id": "$t(curiosity-graph.legendTooltip_Sockets_virtual_RHEL)",
    "legendTooltip_threshold_Sockets_your-variant-id": "$t(curiosity-graph.legendTooltip_threshold_Sockets_RHEL)"
  },
  "curiosity-inventory": {
    "tabInstances_your-variant-id": "$t(curiosity-inventory.tabInstances_RHEL)"
  }
}
```

**Requirements:**
- Add entries to ALL relevant sections (toolbar, view, graph, inventory)
- Use the correct product ID exactly as defined in the constants
- Maintain alphabetical order within each section
- For standard descriptions that match RHEL, use the `$t()` translation reference

### Step 4: Update Test Snapshots

After making the changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

This will update snapshots in various files including:
- `src/services/rhsm/__tests__/__snapshots__/rhsmConstants.test.js.snap`
- `src/components/router/__tests__/__snapshots__/routerHelpers.test.js.snap` (if affected)

### Step 5: Run ESLint Fix

Apply code formatting and linting fixes using the project's npm script:

```bash
npm run test:lintfix
```

**⚠️ Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes, such as:
- Converting line comments (`//`) to block comments (`/* */`)
- Modifying unrelated code sections
- Changes to parts of the file not related to your variant addition

**Focus only on changes directly related to the new variant.**

### Step 6: Run Tests

Verify all tests pass with the updated code:

```bash
npm run test:ci
```

You can also run specific tests for the constants file:

```bash
npm run test:ci -- --testPathPattern=rhsmConstants.test.js
```

## Real-World Examples

Examining recent commits shows the standard pattern for adding RHEL variants:

### Example 1: Adding RHEL AUS Add-On (Annual)

**Constant added:**
```javascript
RHEL_AUS_ADDON: 'rhel-aus-addon',
```

**Localization entries added:**
```json
{
  "curiosity-toolbar": {
    "label_groupVariant_rhel-aus-addon": "RHEL Advanced Update Support Add-On, Annual"
  },
  "curiosity-view": {
    "title_rhel-aus-addon": "Red Hat Enterprise Linux Advanced Update Support Add-On, Annual",
    "subtitle_rhel-aus-addon": "$t(curiosity-view.subtitle_RHEL)",
    "description_rhel-aus-addon": "$t(curiosity-view.description_RHEL)"
  }
}
```

### Example 2: Adding RHEL for x86 ELS Unconverted

**Constant added:**
```javascript
RHEL_X86_ELS_UNCONVERTED: 'rhel-for-x86-els-unconverted',
```

**Localization entries added:**
```json
{
  "curiosity-toolbar": {
    "label_groupVariant_rhel-for-x86-els-unconverted": "RHEL for x86 ELS Annual"
  },
  "curiosity-view": {
    "title_rhel-for-x86-els-unconverted": "Red Hat Enterprise Linux for x86 Extended Life Cycle Support, Annual",
    "subtitle_rhel-for-x86-els-unconverted": "$t(curiosity-view.subtitle_RHEL)",
    "description_rhel-for-x86-els-unconverted": "$t(curiosity-view.description_RHEL)"
  }
}
```

## Git Reference Commits

For complete implementation details and full context, refer to these actual commits:

### RHEL AUS Add-On Implementation
- **Commit Hash**: `7e5fe666e104bddfd1ff91a22619332407ba147b`
- **Description**: Add RHEL Advanced Update Support Add-On variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### RHEL for x86 ELS Unconverted Implementation  
- **Commit Hash**: `bd534990f5f6c2bcf44eaa1c113cde11959c0d14`
- **Description**: Add RHEL for x86 Extended Life Cycle Support variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### RHEL for x86 RS Implementation
- **Commit Hash**: `0afc6e4111a9e2f18a623cbd8ab8f4f68a8e9c5f`
- **Description**: Add RHEL for x86 RS variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### RHEL for x86 HA Implementation
- **Commit Hash**: `23c42dea75f165e4d0dfb12910247a2c9abdda87`
- **Description**: Add RHEL for x86 HA variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### RHEL for x86 EUS Implementation
- **Commit Hash**: `651188ac8e18a9315b3f4dfa1b5d1018ec5e3c3c`
- **Description**: Add RHEL for x86 EUS variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### RHEL for SAP x86 Implementation
- **Commit Hash**: `5267af002885ef30040662dafea3f2ba339ebe72`
- **Description**: Add RHEL for SAP x86 variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

## File Checklist

- [ ] Add variant constant to `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (all 3+ locations)
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` to update test snapshots
- [ ] Run `npm run test:lintfix` to format code
- [ ] Run `npm run test:ci` to verify all tests pass

## Common Pitfalls

❌ **Don't:**
- Forget to update ALL JSDoc type annotations
- Skip adding entries to ALL necessary localization sections
- Use inconsistent naming conventions
- Change unrelated parts of the constants file
- Add a new product config file

✅ **Do:**
- Follow alphabetical ordering in all locations
- Use consistent naming patterns for similar variant types
- Add ALL required localization entries
- Verify all tests pass before committing

## Troubleshooting Guide

### Common Issues and Solutions

1. **Duplicate Product IDs**
   - **Issue**: Adding a variant with an existing product ID
   - **Solution**: Check `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES` for existing IDs first

2. **Missing Localization**
   - **Issue**: Incomplete string definitions causing UI display issues
   - **Solution**: Ensure ALL required localization entries are added
   - **Sections to check**: `curiosity-toolbar`, `curiosity-view`, `curiosity-graph`, `curiosity-inventory`

3. **JSDoc Type Errors**
   - **Issue**: Type definitions not updated correctly
   - **Solution**: Update ALL JSDoc locations mentioned in Step 2
   - **Impact**: Can cause TypeScript/IDE errors and documentation issues

4. **Unrelated JSDoc Fixes**
   - **Issue**: ESLint making changes to unrelated annotations
   - **Solution**: Carefully review git diff and revert unrelated changes

5. **Test Snapshot Failures**
   - **Issue**: Snapshots not updated or inconsistent changes
   - **Solution**: Run the updateSnapshot command and verify changes are as expected

## Integration Points

The RHEL variant configuration integrates with:
- **Constants**: Used throughout the application to identify products
- **Localization**: Determines how the variant appears in the UI
- **Router**: Used for URL routing based on product ID
- **API Integration**: Product ID must match backend expectations

## Testing Strategy

1. **Unit Tests**: Verify constants and snapshots update correctly
2. **Integration Testing**: Ensure the new variant appears in navigation
3. **Manual Testing**: Verify UI displays the correct labels and strings
4. **API Testing**: Confirm backend recognizes the variant ID

## Maintenance Guidelines

- **Naming Consistency**: Follow established patterns for similar variant types
- **Documentation**: Update relevant documentation if adding a new variant type
- **Refactoring**: If changing multiple variants, consider grouping similar changes
- **Code Reviews**: Pay close attention to JSDoc updates and localization entries

## Related Documentation

- See `guidelines/project-workflows/adding-openshift-product.md` for similar product configuration patterns
- Review existing RHEL variants in the codebase for naming conventions
- Check the backend API documentation for supported product IDs
