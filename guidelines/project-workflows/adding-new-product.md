---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "config/*.js", "*.json"]
contexts: ["development", "product-config"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-07-01"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "sequential"
  validation_required: true
  key_concepts: ["product-config", "new-product", "product-category", "metrics"]
  related_guidelines: [
    "guidelines/project-workflows/adding-openshift-product.md", 
    "guidelines/project-workflows/adding-rhel-annual-variant.md", 
    "guidelines/project-workflows/adding-rhel-payg-variant.md"
  ]
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  trigger_phrases: ["create a product", "make a new product", "add a product", "new product"]
  critical_instructions: "ALWAYS ask the sequential questions when creating a new product"
---

# Adding a New Product

This guide provides step-by-step instructions for adding new product configurations to the curiosity-frontend application. It covers various product types including OpenShift hourly products, RHEL annual variants, and RHEL PAYG variants.

## Overview

Products in this application are configured as either:
- **Hourly/On-Demand Products**: Track usage metrics like cores, vCPUs, and instance hours (OpenShift products, RHEL PAYG)
- **Annual/Capacity Products**: Track capacity-based metrics like sockets and cores (RHEL variants)

This guide helps determine the correct configuration approach based on the product category and billing model.

## Interactive Configuration Process

When asked to **"create a product"**, **"make a new product"**, or similar phrases, you MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product category?"** - Determine the general product group
   - Options: `openshift`, `rhel-annual`, `rhel-payg`, or `other`
   - This determines the configuration template to use

2. **"What is the product id?"** - The API identifier for the product (e.g., "rhacs", "rhel-for-x86-els-payg")
   - For OpenShift: Typically a simple name like "rhods", "rhacs"
   - For RHEL Annual: Format like "RHEL for x86" or "rhel-for-x86-eus"
   - For RHEL PAYG: Format like "rhel-x86-els-payg" or "rhel-for-sap-payg"

3. **"What is the product long, or full, name?"** - The complete display name
   - OpenShift example: "Red Hat Advanced Cluster Security"
   - RHEL Annual example: "Red Hat Enterprise Linux for x86"
   - RHEL PAYG example: "Red Hat Enterprise Linux for x86 Extended Life Cycle Support, Pay-As-You-Go"

4. **"What is the product short name?"** - The abbreviated display name
   - OpenShift example: "RHACS"
   - RHEL example: "RHEL for x86 ELS"
   - RHEL PAYG example: "RHEL for x86 ELS PAYG"

5. **"Is there an existing product variant config that matches what you want?"**
   - If **no**: Continue to question 7
   - If **yes**: Continue to question 6

6. **"What existing product config matches what you want?"** - Specify which existing config to use as template (e.g., "rhacs", "rhel-for-x86")

7. **"What metric needs to be displayed?"** - The primary metric for charts and inventory
   - OpenShift examples: "Cores", "vCPUs", "Instance-hours"
   - RHEL examples: "Sockets", "Cores"
   - PAYG examples: "vCPUs", "Instance-hours"

8. **"Is the metric display name unique?"** - Does the technical metric need to display differently to users?
   - If **yes**: "What should the metric display as?" (e.g., technical: "Cores" → display: "vCPUs")
   - If **no**: Use the standard metric display name

**Based on the responses to these questions, determine which specific workflow to follow:**

- If **OpenShift category**: Follow the OpenShift Hourly Product workflow (see separate guide)
- If **RHEL Annual category**: Follow the RHEL Annual Variant workflow (see separate guide)
- If **RHEL PAYG category**: Follow the RHEL PAYG Variant workflow (see separate guide)
- If **Other category**: Use the most similar product configuration as a template

## Step-by-Step Implementation

### Step 1: Add Product Constant

Add the new product ID to `src/services/rhsm/rhsmConstants.js` in the appropriate section and alphabetical order:

```javascript
// For OpenShift products
const RHSM_API_PATH_PRODUCT_TYPES = {
  // ... existing products
  NEW_PRODUCT: 'new-product',  // <-- Add your product here
  // ... rest of products in alphabetical order
};

// For RHEL annual variants
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  // ... existing variants
  RHEL_NEW_VARIANT: 'rhel-for-new-variant',  // <-- Add your variant here
  // ... rest of variants in alphabetical order
};

// For RHEL PAYG variants
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES = {
  // ... existing variants
  RHEL_NEW_VARIANT_PAYG: 'rhel-for-new-variant-payg',  // <-- Add your PAYG variant here
  // ... rest of variants in alphabetical order
};
```

**Requirements:**
- Use UPPER_SNAKE_CASE for the constant name
- Use kebab-case or the exact API identifier for the value
- Maintain alphabetical ordering within the object
- Add to the appropriate constant object based on product type

### Step 2: Update JSDoc Type Annotations

Update all JSDoc type annotations in `rhsmConstants.js` to include the new product. Find all relevant locations:

**Location 1: Variant-specific type annotation**
```javascript
/**
 * RHSM path IDs for product [TYPE] variants.
 *
 * @type {{EXISTING_PRODUCT: string, ANOTHER_PRODUCT: string, YOUR_NEW_PRODUCT: string}}
 */
```

**Location 2: Combined product types JSDoc**
```javascript
/**
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, YOUR_NEW_PRODUCT: string, RHEL_X86_ELS_UNCONVERTED: string,
 *     RHEL_WORKSTATION: string, RHODS: string, ROSA: string, RHEL_COMPUTE_NODE: string, OPENSHIFT: string}}
 */
```

**Location 3-4: Main rhsmConstants JSDoc**
Search for large JSDoc blocks that list all product types and add your product in alphabetical order.

### Step 3: Create Product Configuration File

Create `src/config/product.yourProduct.js` using the appropriate template based on product category:

```javascript
import React from 'react';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import { chartColorBlueLight, chartColorBlueDark } from '../common/tokenHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chartHelpers';
import { dateHelpers, helpers } from '../common';
import { SelectPosition } from '../components/form/select';
import { Tooltip } from '../components/tooltip/tooltip';
import { translate } from '../components/i18n/i18n';

/**
 * Your Product Name
 *
 * @memberof Products
 * @module YourProduct
 */

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = 'your-product-group'; // 'openshift', 'rhel', etc.

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.YOUR_PRODUCT;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = 'Your-Product-Label';

/**
 * Product configuration
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string,
 *     inventorySubscriptionsQuery: object, query: object, onloadProduct: Array,
 *     initialInventorySettings: object, viewId: string, initialToolbarFilters: Array, productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string, initialGraphFilters: Array,
 *     initialGraphSettings: object, initialInventoryFilters: Array}}
 */
const config = {
  aliases: ['alias1', 'alias2'], // Add relevant aliases for your product
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY, // Or DISPLAY_TYPES.CAPACITY for annual products
  viewId: `view${productGroup}-${productId}`,
  onloadProduct: [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID],
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
    {
      metric: RHSM_API_PATH_METRIC_TYPES.YOUR_METRIC, // Use appropriate metric (Cores, vCPUs, etc.)
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],
  // Additional config settings go here based on the product category template
};

export { config as default, config, productGroup, productId };
```

**Important**: Use an existing product configuration as a template based on your product category:
- For OpenShift: Use `src/config/product.rhacs.js` or similar
- For RHEL Annual: Use `src/config/product.rhel.js` or similar
- For RHEL PAYG: Use `src/config/product.rhelElsPayg.js` or similar

### Step 4: Add Localization Entries

Add the necessary translation entries to `public/locales/en-US.json` for your new product:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_your-product-id": "Your Product Short Name"
  },
  "curiosity-view": {
    "title_your-product-id": "Your Product Full Name",
    "subtitle_your-product-id": "Your product subtitle or $t(curiosity-view.subtitle_RELATED_PRODUCT)",
    "description_your-product-id": "Your product description or $t(curiosity-view.description_RELATED_PRODUCT)"
  }
}
```

For your product, you may also need to add entries to the following sections if they don't already inherit from existing configurations:

```json
{
  "curiosity-graph": {
    "legendTooltip_YourMetric_your-product-id": "Your metric tooltip text"
  },
  "curiosity-inventory": {
    "tabInstances_your-product-id": "Instances"
  }
}
```

### Step 5: Update Import in products.js

Update `src/config/products.js` to import and export your new product configuration:

```javascript
import productRhel from './product.rhel';
import productRhelElsPayg from './product.rhelElsPayg';
import productRhacs from './product.rhacs';
import productYourProduct from './product.yourProduct'; // <-- Add your import here

const products = {
  productRhel,
  productRhelElsPayg,
  productRhacs,
  productYourProduct // <-- Add your product export here
};

export {
  products as default,
  products,
  productRhel,
  productRhelElsPayg,
  productRhacs,
  productYourProduct // <-- Add your product export here
};
```

### Step 6: Update Test Snapshots

After making the changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

This will update snapshots in various files including:
- `src/services/rhsm/__tests__/__snapshots__/rhsmConstants.test.js.snap`
- `src/components/router/__tests__/__snapshots__/routerHelpers.test.js.snap` (if affected)

### Step 7: Run ESLint Fix

Apply code formatting and linting fixes using the project's npm script:

```bash
npm run test:lintfix
```

**⚠️ Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes to unrelated code sections.

### Step 8: Run Tests

Verify all tests pass with the updated code:

```bash
npm run test:ci
```

## Product Category-Specific Instructions

### OpenShift Products

For OpenShift hourly products:
- Use `productGroup = 'openshift'`
- Use `productDisplay = DISPLAY_TYPES.HOURLY`
- Typical metrics include `Cores`, `vCPUs`, or `Instance-hours`
- See `guidelines/project-workflows/adding-openshift-product.md` for detailed OpenShift workflow

### RHEL Annual Variants

For RHEL annual variants:
- Use `productGroup = 'rhel'`
- Use `productDisplay = DISPLAY_TYPES.CAPACITY`
- Typical metrics include `Sockets` and `Cores`
- For variants, add to `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES`
- See `guidelines/project-workflows/adding-rhel-annual-variant.md` for detailed RHEL annual workflow

### RHEL PAYG Variants

For RHEL PAYG variants:
- Use `productGroup = 'rhel'`
- Use `productDisplay = DISPLAY_TYPES.HOURLY`
- Typical metrics include `vCPUs` and `Instance-hours`
- For PAYG variants, add to `RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES`
- See `guidelines/project-workflows/adding-rhel-payg-variant.md` for detailed RHEL PAYG workflow

## File Checklist

- [ ] Add product constant to `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (all locations)
- [ ] Create product configuration file in `src/config/product.yourProduct.js`
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Update `src/config/products.js` to import and export the new product
- [ ] Run `npm run test:ci -- --updateSnapshot` to update test snapshots
- [ ] Run `npm run test:lintfix` to format code
- [ ] Run `npm run test:ci` to verify all tests pass

## Common Pitfalls

❌ **Don't:**
- Forget to update ALL JSDoc type annotations
- Skip adding entries to ALL necessary localization sections
- Use inconsistent naming conventions
- Forget to export the new product in `products.js`
- Use the wrong product display type for the product category

✅ **Do:**
- Follow alphabetical ordering in all locations
- Use consistent naming patterns for similar product types
- Add ALL required localization entries
- Verify all tests pass before committing
- Use an existing product of the same category as a template

## Integration Points

The product configuration integrates with:
- **Router**: Uses `productPath` for URL routing
- **API Services**: Uses `productId` for API calls
- **Localization**: Uses product ID for translation keys
- **Charts**: Uses metric types and display settings
- **Inventory**: Uses inventory filters and sorting

## Testing Strategy

1. **Unit Tests**: Verify constants and snapshots update correctly
2. **Integration Testing**: Ensure the new product appears in navigation
3. **Manual Testing**: Verify UI displays the correct labels, charts, and inventory
4. **API Testing**: Confirm backend recognizes the product ID and returns data

## Maintenance Guidelines

- **Naming Consistency**: Follow established patterns for similar product types
- **Documentation**: Update relevant documentation when adding a new product type
- **Refactoring**: If changing multiple products, consider grouping similar changes
- **Code Reviews**: Pay close attention to JSDoc updates and localization entries

## Related Documentation

- See `guidelines/project-workflows/adding-openshift-product.md` for OpenShift-specific workflows
- See `guidelines/project-workflows/adding-rhel-annual-variant.md` for RHEL annual variant workflows
- See `guidelines/project-workflows/adding-rhel-payg-variant.md` for RHEL PAYG variant workflows
- Review existing product configurations in the codebase for reference
- Check the backend API documentation for supported product IDs and metrics
