guideline_version: "1.0.0"
title: "Adding RHEL Variants"
priority: 3
applies_to: ["*.js", "config/*.js", "*.json"]
contexts: ["development", "product-config"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
agent_hints:
  processing_order: "sequential"
  validation_required: true
  question_sequence: true
  wait_for_response: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding a RHEL variant"
---

# Adding RHEL Variants

## Required Question Sequence

When a user requests to "add a rhel variant", "create a rhel variant", or "create an annual rhel variant", you MUST ask these questions in sequence:

1. "What is the product ID for the variant?"
  - Wait for response
  - Examples:
     * RHEL for x86
     * rhel-for-x86-eus
     * rhel-for-x86-els-unconverted
  - Validate format:
    * Standard variants: Use "RHEL for [Purpose]" format
    * ELS variants: Use "rhel-for-[purpose]-[type]" format

2. "What is the product variant complete long, or full, name?"
  - Wait for response
  - Examples:
    * Red Hat Enterprise Linux for x86
    * Red Hat Enterprise Linux for x86 EUS
    * Red Hat Enterprise Linux Extended Life Cycle Support Add-On, Annual
  - Validate format:
    * Full name for UI descriptive text
    * Standard variants: Use "Red Hat Enterprise Linux [Purpose]" format

3. "What is the product variant short name?"
   - Wait for response
   - Examples
     * RHEL for x86
     * RHEL for x86 EUS
     * RHEL for x86 ELS Annual
   - Validate format:
     * Short name for UI display and interaction
     * Should be human-readable
     * Follow existing naming patterns

**IMPORTANT:**
- DO NOT proceed with implementation until all questions are answered and validated.
- DO NOT assume any next steps
- DO NOT ask extra step questions
- Each question MUST be asked separately, waiting for a response before proceeding to the next question
- Do NOT skip any of these questions unless the user asks you to exit or stop the process.
- Do NOT assume any values; always ask for explicit confirmation
- Exit the process after completing the steps

## Step-by-Step Process

**IMPORTANT:**
- If confirmation is needed to update files ask for confirmation with bulk, or grouped, "accept changes"
- DO NOT use verbose logging instead keep logging concise and clear

### 1. Add Variant to Constants.

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

There are on average **three locations** in `rhsmConstants.js` where JSDocs is updated:

1. **RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES type annotation** (around line 8-11)
2. **RHSM_API_PATH_PRODUCT_TYPES type annotation** (around line 47-53)
3. **Main rhsmConstants JSDoc** (around line 470+) - appears in two places in the large type definition

**Example:**
```javascript
/**
 * @type {{RHEL_ARM: string, RHEL_AUS_ADDON: string, RHEL_IBM_Z: string, RHEL_LOREM_IPSUM: string, RHEL_X86: string, ...}}
 */
```

**Key Points**
- JSDoc type annotations should include the new variant like `RHEL_[VARIANT]: string` to each type definition
- Annotations should maintain alphabetical order

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

**Example using rhelLoremIpsum:**
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

**Key Points**
- When creating entries in the `curiosity-toolbar` `curiosity-view`, and `curiosity-graph` sections attempt to match existing sorting and grouping

### 4. Update Test Snapshots

After making the changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

This will update snapshots in:
- `src/services/rhsm/__tests__/__snapshots__/rhsmConstants.test.js.snap`

### 5. Run ESLint Fix.

Apply code formatting and linting fixes using the project's npm script:

```bash
npm run test:lintfix
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

## File Checklist

- [ ] `src/services/rhsm/rhsmConstants.js` - Add constant and update JSDoc
- [ ] `public/locales/en-US.json` - Add localization entries
- [ ] Run `npm run test:ci -- --updateSnapshot` - Update snapshots
- [ ] Run `npm run test:lintfix` - Format code
- [ ] Run tests to validate changes

## Related Documentation

### Common Issues and Solutions

1. **Duplicate Product IDs**
  - **Issue**: Adding a variant with an existing product ID
  - **Solution**: Check `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES` for existing IDs first then ask for next steps

2. **Missing Localization**
  - **Issue**: Incomplete string definitions
  - **Solution**: Use the template provided in step 3 and verify all sections

3. **JSDoc Type Errors**
  - **Issue**: Type definitions not updated
  - **Solution**: Update all three JSDoc locations mentioned in step 2

4. **Unrelated JSDoc fixes**
- **Issue**: JSDoc automated linting fixes correct unrelated annotations
- **Solution**: Update JSDoc annotations according to the important notes in step 5
