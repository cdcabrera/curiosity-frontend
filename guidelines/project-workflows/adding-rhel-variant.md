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
---

# Adding RHEL Variants

## Required Question Sequence

When a user requests to "add a rhel variant", "create a rhel variant", or "create an annual rhel variant", you MUST ask these questions in sequence:

1. "What type of RHEL variant is needed (architecture-specific, use-case specific, or ELS PAYG variant)?"
   - Wait for response
   - Validate against known types:
     * Architecture-specific (e.g., ARM, IBM Power)
     * Use-case specific (e.g., SAP, HA)
     * ELS PAYG variant

2. "What is the product ID for the variant?"
   - Wait for response
   - Validate format:
     * Standard variants: Use "RHEL for [Purpose]" format
     * ELS variants: Use "rhel-for-[purpose]-[type]" format
     * All lowercase with hyphens for API values

3. "What is the display name for the variant?"
   - Wait for response
   - Validate format:
     * Full name for UI display
     * Should be human-readable
     * Follow existing naming patterns



**IMPORTANT:**
- DO NOT proceed with implementation until all questions are answered and validated.
- Each question MUST be asked separately, waiting for a response before proceeding to the next question
- Do NOT skip any of these questions unless the user asks you to exit or stop the process.
- Do NOT assume any values; always ask for explicit confirmation

## Implementation Steps

### 1. Add Variant to Constants

**File:** `src/services/rhsm/rhsmConstants.js`

Add the new variant to the appropriate constant object based on the variant type:

```javascript
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  // For standard RHEL variants
  RHEL_ARM: 'RHEL for ARM',
  // Add new variant here
};

// OR for ELS PAYG variants
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES = {
  RHEL_X86_ELS_PAYG: 'rhel-for-x86-els-payg',
  // Add new ELS variant here
};
```

**Key Points:**
- Use a descriptive constant name (e.g., `RHEL_LOREM_IPSUM`)
- The value should be the product ID used by the API
- Insert alphabetically to maintain order
- Follow existing naming conventions

### 2. Update JSDoc Annotations

Update the JSDoc type annotations to include the new variant, maintaining alphabetical order.

**File:** `src/services/rhsm/rhsmConstants.js`

There are **three locations** in `rhsmConstants.js` where JSDocs is typically updated:

1. **RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES type annotation** (around line 8-11)
2. **RHSM_API_PATH_PRODUCT_TYPES type annotation** (around line 47-53)
3. **Main rhsmConstants JSDoc** (around line 470+) - appears in two places in the massive type definition

**Example:**
```javascript
/**
 * @type {{RHEL_ARM: string, RHEL_AUS_ADDON: string, RHEL_IBM_Z: string, RHEL_LOREM_IPSUM: string, RHEL_X86: string, ...}}
 */
```

### 3. Add Localization Entries

**File:** `public/locales/en-US.json`

Add entries for the new variant:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_[product-id]": "[Short Title]"
  },
  "curiosity-view": {
    "title_[product-id]": "[Full Title]",
    "subtitle_[product-id]": "$t(curiosity-view.subtitle_RHEL)",
    "description_[product-id]": "$t(curiosity-view.description_RHEL)"
  }
}
```

### 4. Update Test Snapshots

After making the changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

### 5. Validate Changes

Run the specific tests to ensure everything works correctly:

```bash
npm run test:ci -- --testPathPattern=rhsmConstants.test.js
```

## Naming Conventions

### Constant Names
- Format: `RHEL_[DESCRIPTIVE_NAME]`
- Use uppercase with underscores
- Be descriptive but concise

### Product IDs (API Values)
- Use lowercase with hyphens or descriptive names
- Match what the backend API expects

### Localization Keys
- **Toolbar labels:** `label_groupVariant_[product-id]`
- **View titles:** `title_[product-id]`
- **View subtitles:** `subtitle_[product-id]`
- **View descriptions:** `description_[product-id]`

## File Checklist

- [ ] `src/services/rhsm/rhsmConstants.js` - Add constant and update JSDoc
- [ ] `public/locales/en-US.json` - Add localization entries
- [ ] Run `npm run test:ci -- --updateSnapshot` - Update snapshots
- [ ] Run `npm run test:lintfix` - Format code
- [ ] Run tests to validate changes
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

### Value Patterns

#### Product IDs
- Use kebab-case for API identifiers
- Follow the pattern: `rhel-for-[platform]-[variant]`
- Examples:
  - `rhel-for-x86-eus`
  - `rhel-for-arm`
  - `rhel-aus-addon`

#### Display Names
- **Long Names**
  - Format: "Red Hat Enterprise Linux for [Platform] [Variant]"
  - Capitalize properly
  - Spell out abbreviations in full names
  - Examples:
    - "Red Hat Enterprise Linux for x86 Extended Update Support"
    - "Red Hat Enterprise Linux for ARM"

- **Short Names**
  - Format: "RHEL for [Platform] [Variant]"
  - Use standard abbreviations
  - Keep it concise but clear
  - Examples:
    - "RHEL for x86 EUS"
    - "RHEL for ARM"

### Testing Requirements

1. **Constants Tests**
   - Verify the new constant is exported
   - Check alphabetical ordering
   - Validate type definitions
   ```javascript
   describe('RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES', () => {
     it('should have the new variant defined', () => {
       expect(RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES.RHEL_NEW_VARIANT).toBeDefined();
     });
   });
   ```

2. **Localization Tests**
   - Verify all required strings exist
   - Check string interpolation
   ```javascript
   describe('Localization', () => {
     it('should have all required strings for the new variant', () => {
       const messages = getMessages('en-US');
       expect(messages['curiosity-toolbar'][`label_groupVariant_${productId}`]).toBeDefined();
       expect(messages['curiosity-view'][`title_${productId}`]).toBeDefined();
     });
   });
   ```

### Common Issues and Solutions

1. **Duplicate Product IDs**
   - **Issue**: Adding a variant with an existing product ID
   - **Solution**: Check `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES` for existing IDs first

2. **Missing Localization**
   - **Issue**: Incomplete string definitions
   - **Solution**: Use the template provided in step 3 and verify all sections

3. **JSDoc Type Errors**
   - **Issue**: Type definitions not updated
   - **Solution**: Update all three JSDoc locations mentioned in step 2

### Post-Implementation Checklist

1. **Code Review**
   - [ ] Constants follow naming conventions
   - [ ] JSDoc types are complete and correct
   - [ ] Localization strings are properly formatted
   - [ ] Tests pass and cover new changes

2. **Manual Testing**
   - [ ] Variant appears in dropdown
   - [ ] Display names are correct
   - [ ] Navigation works correctly
   - [ ] Data display is accurate

3. **Documentation**
   - [ ] Update relevant documentation
   - [ ] Add implementation notes if needed
   - [ ] Document any special cases

### Appendix: Example Implementation

Complete example of adding a new RHEL variant:
