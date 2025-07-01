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
  key_concepts: ["rhel", "payg", "pay-as-you-go", "hourly", "on-demand", "product-config"]
  related_guidelines: ["guidelines/project-workflows/adding-openshift-product.md", "guidelines/project-workflows/adding-rhel-annual-variant.md"]
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding a RHEL PAYG variant"
---

# Adding RHEL PAYG Variants

This guide provides step-by-step instructions for adding new RHEL Pay-As-You-Go (PAYG) variant configurations to the curiosity-frontend application.

## Overview

RHEL PAYG variants in this application represent hourly-billed or on-demand consumption models for Red Hat Enterprise Linux. Unlike annual variants that focus on capacity-based metrics, PAYG variants typically track hourly usage metrics like vCPUs and are configured with the `DISPLAY_TYPES.HOURLY` display type.

## Interactive Configuration Process

When asked to **"add a rhel payg variant"**, **"create a rhel payg"**, or **"create a rhel on-demand variant"**, you MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product ID for the PAYG variant?"** - The API identifier for the variant
   - Examples: `rhel-x86-els-payg`, `rhel-for-sap-payg`, `rhel-for-x86-hourly`
   - PAYG variants typically use format: `rhel-[purpose]-payg` or `rhel-for-[purpose]-payg`

2. **"What is the product variant complete long, or full, name?"** - The complete display name
   - Examples: `Red Hat Enterprise Linux for x86 Extended Life Cycle Support, Pay-As-You-Go`
   - PAYG variants typically include "Pay-As-You-Go" or "On-Demand" in their full names

3. **"What is the product variant short name?"** - The abbreviated display name
   - Examples: `RHEL for x86 ELS PAYG`, `RHEL for SAP PAYG`
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

Add the new PAYG variant to the appropriate RHEL variant object in `src/services/rhsm/rhsmConstants.js` in alphabetical order.

Depending on the variant type (ELS, standard RHEL, etc.), you'll need to add it to the correct constant object:

```javascript
// For ELS PAYG variants
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES = {
  RHEL_X86_ELS_PAYG: 'rhel-x86-els-payg',  // Example of existing ELS PAYG variant
  RHEL_X86_ELS_UNCONVERTED: 'rhel-for-x86-els-unconverted',
  // ... Add your variant here in alphabetical order
};

// For standard RHEL PAYG variants
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  // ... Add your standard RHEL PAYG variant here in alphabetical order
};
```

**Requirements:**
- Use UPPER_SNAKE_CASE for the constant name (e.g., `RHEL_X86_PAYG`)
- Use the exact API identifier for the value (typically kebab-case for variants)
- Maintain alphabetical ordering within the object
- Follow the existing naming pattern for similar variant types
- Ensure you add to the correct variant group (ELS, standard RHEL, etc.)

### Step 2: Update JSDoc Type Annotations

Update all JSDoc type annotations in `rhsmConstants.js` to include the new PAYG variant. You need to modify **at least 3 locations**:

**Location 1: Variant type-specific annotation**
```javascript
/**
 * RHSM path IDs for product RHEL ELS variants.
 *
 * @type {{RHEL_X86_ELS_PAYG: string, RHEL_X86_ELS_UNCONVERTED: string, YOUR_NEW_VARIANT: string}}
 */
```

**Location 2: Combined RHSM_API_PATH_PRODUCT_TYPES type annotation**
This appears within the constants file where all product types are combined.

**Location 3-4: Main rhsmConstants JSDoc**
Search for large JSDoc blocks that list all product types (typically around line 470+) and add your variant in alphabetical order. These appear in multiple places in the large type definition.

**Requirements:**
- Add your variant to ALL JSDoc annotations that list related RHEL variants
- Maintain alphabetical order in each annotation
- Keep consistent formatting with existing annotations

### Step 3: Create Product Configuration File

Create a new product configuration file at `src/config/product.yourVariantName.js`. 

Use this template, which is based on existing PAYG variant configurations:

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
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES,
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES // Import the appropriate variant group
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chart';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { translate } from '../components/i18n/i18n';

/**
 * RHEL PAYG Variant Name
 *
 * @memberof Products
 * @module RHEL-VARIANT-NAME
 */

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = 'rhel';

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.YOUR_VARIANT_CONSTANT;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = 'RHEL';

/**
 * Product configuration
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string, onloadProduct: Array,
 *     inventorySubscriptionsQuery: object, query: object, initialSubscriptionsInventoryFilters: Array,
 *     initialInventorySettings: object, viewId: string, initialToolbarFilters: Array, productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string, productVariants: string[],
 *     initialGraphFilters: Array, initialGraphSettings: object, initialInventoryFilters: Array}}
 */
const config = {
  aliases: ['payg', 'hourly', 'on-demand'], // Add specific aliases for your variant
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY,
  viewId: `view${productGroup}-${productId}`,
  productVariants: [...Object.values(RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES)], // Use appropriate variant group
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
      metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],
  initialGraphSettings: {
    cards: [
      {
        header: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardHeadingMetric', {
            context: ['dailyTotal', dataSets?.[0]?.display?.chartId],
            testId: 'graphDailyTotalCard-header'
          }),
        body: ({ dataSets = [] } = {}) =>
          translate(
            'curiosity-graph.cardBodyMetric',
            {
              context: ['total', dataSets?.[0]?.display?.dailyHasData && dataSets?.[0]?.display?.chartId],
              testId: 'graphDailyTotalCard-body',
              total: helpers
                .numberDisplay(dataSets?.[0]?.display?.dailyValue)
                ?.format({
                  average: true,
                  mantissa: 2,
                  trimMantissa: true,
                  lowPrecision: false
                })
                ?.toUpperCase()
            },
            [<strong title={dataSets?.[0]?.display?.dailyValue} aria-label={dataSets?.[0]?.display?.dailyValue} />]
          ),
        footer: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardFooterMetric', {
            date: moment
              .utc(dataSets?.[0]?.display?.dailyDate)
              .format(dateHelpers.timestampUTCTimeFormats.yearTimeShort),
            testId: 'graphDailyTotalCard-footer'
          })
      },
      {
        header: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardHeadingMetric', {
            context: ['monthlyTotal', dataSets?.[0]?.display?.chartId],
            testId: 'graphMonthlyTotalCard-header'
          }),
        body: ({ dataSets = [] } = {}) =>
          translate(
            'curiosity-graph.cardBodyMetric',
            {
              context: ['total', dataSets?.[0]?.display?.monthlyHasData && dataSets?.[0]?.display?.chartId],
              testId: 'graphMonthlyTotalCard-body',
              total: helpers
                .numberDisplay(dataSets?.[0]?.display?.monthlyValue)
                ?.format({
                  average: true,
                  mantissa: 2,
                  trimMantissa: true,
                  lowPrecision: false
                })
                ?.toUpperCase()
            },
            [<strong title={dataSets?.[0]?.display?.monthlyValue} aria-label={dataSets?.[0]?.display?.monthlyValue} />]
          ),
        footer: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardFooterMetric', {
            date: moment
              .utc(dataSets?.[0]?.display?.monthlyDate)
              .format(dateHelpers.timestampUTCTimeFormats.yearTimeShort),
            testId: 'graphMonthlyTotalCard-footer'
          })
      }
    ],
    isCardTitleDescription: true,
    xAxisChartLabel: () => translate('curiosity-graph.label_axisX', { context: GRANULARITY_TYPES.DAILY }),
    yAxisTickFormat: ({ tick } = {}) => {
      if (tick > 1) {
        return helpers
          .numberDisplay(tick)
          ?.format({ average: true, mantissa: 1, trimMantissa: true, lowPrecision: false })
          ?.toUpperCase();
      }
      return helpers
        .numberDisplay(tick)
        ?.format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: true })
        ?.toUpperCase();
    }
  },
  initialInventoryFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      cell: ({ [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId } = {}) => {
        // For inventory links - may be disabled in some variants
        const { inventory: authorized = false } = {};

        if (!instanceId) {
          return displayName;
        }

        let updatedDisplayName = displayName || instanceId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${instanceId}`}
            >
              {updatedDisplayName}
            </Button>
          );
        }

        return updatedDisplayName;
      },
      isSort: true
    },
    {
      metric: INVENTORY_TYPES.BILLING_PROVIDER,
      info: {
        tooltip: () =>
          translate(`curiosity-inventory.tooltip`, {
            context: ['header', INVENTORY_TYPES.BILLING_PROVIDER]
          })
      },
      cell: ({ [INVENTORY_TYPES.BILLING_PROVIDER]: provider, [INVENTORY_TYPES.BILLING_ACCOUNT_ID]: account }) => (
        <Tooltip
          content={translate(`curiosity-inventory.tooltip`, {
            context: ['cell', INVENTORY_TYPES.BILLING_PROVIDER, !provider && 'none'],
            provider: translate('curiosity-inventory.label', {
              context: [INVENTORY_TYPES.BILLING_PROVIDER, provider]
            }),
            account
          })}
        >
          {translate('curiosity-inventory.label', {
            context: [INVENTORY_TYPES.BILLING_PROVIDER, provider || 'none']
          })}
        </Tooltip>
      ),
      isSort: true,
      isWrap: true,
      width: 20
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.VCPUS]: total } = {}) =>
        (!total && '--') ||
        translate('curiosity-inventory.measurement', {
          context: (total && RHSM_API_PATH_METRIC_TYPES.VCPUS) || undefined,
          total: helpers.numberDisplay(total)?.format({ mantissa: 5, trimMantissa: true }),
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.VCPUS}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ]
};

export { config as default, config };
```

**Key elements to customize:**
- Update the JSDoc module name and description
- Set the correct `productId` constant reference
- Update `productVariants` to use the appropriate variant group
- Customize `aliases` for your specific variant
- If needed, adjust metrics from `VCPUS` to other metrics like `CORES` or `INSTANCE_HOURS`

### Step 4: Add Localization Entries

Add the necessary translation entries to `public/locales/en-US.json` for your new PAYG variant:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_your-variant-id": "Your RHEL PAYG Variant Short Name"
  },
  "curiosity-view": {
    "title_your-variant-id": "Your RHEL PAYG Variant Full Name",
    "subtitle_your-variant-id": "$t(curiosity-view.subtitle_RHEL)",
    "description_your-variant-id": "Monitor your RHEL PAYG usage for cloud provider subscriptions."
  }
}
```

For RHEL PAYG variants, you'll typically need custom descriptions that emphasize the on-demand nature of the product rather than using the standard RHEL descriptions.

**Requirements:**
- Add entries to ALL relevant sections (toolbar, view)
- Use the correct product ID exactly as defined in the constants
- Maintain alphabetical order within each section
- Include Pay-As-You-Go specific terminology in the descriptions

### Step 5: Update Test Snapshots

After making the changes, update the test snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

This will update snapshots in various files including:
- `src/services/rhsm/__tests__/__snapshots__/rhsmConstants.test.js.snap`
- `src/components/router/__tests__/__snapshots__/routerHelpers.test.js.snap` (if affected)

### Step 6: Run ESLint Fix

Apply code formatting and linting fixes using the project's npm script:

```bash
npm run test:lintfix
```

**⚠️ Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes, such as:
- Converting line comments (`//`) to block comments (`/* */`)
- Modifying unrelated code sections
- Changes to parts of the file not related to your variant addition

**Focus only on changes directly related to the new variant.**

### Step 7: Run Tests

Verify all tests pass with the updated code:

```bash
npm run test:ci
```

You can also run specific tests for the constants file:

```bash
npm run test:ci -- --testPathPattern=rhsmConstants.test.js
```

## Real-World Examples

Examining recent commits shows the standard pattern for adding RHEL PAYG variants:

### Example: Adding RHEL X86 ELS PAYG

**Constant added:**
```javascript
RHEL_X86_ELS_PAYG: 'rhel-x86-els-payg',
```

**Product configuration structure:**
```javascript
const productGroup = 'rhel';
const productId = RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86_ELS_PAYG;
const productLabel = 'RHEL';

const config = {
  aliases: ['els'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY,
  viewId: `view${productGroup}-${productId}`,
  productVariants: [...Object.values(RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES)],
  onloadProduct: [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID],
  // ... standard configuration continues
};
```

**Localization entries added:**
```json
{
  "curiosity-toolbar": {
    "label_groupVariant_rhel-x86-els-payg": "RHEL for x86 ELS PAYG"
  },
  "curiosity-view": {
    "title_rhel-x86-els-payg": "Red Hat Enterprise Linux for x86 Extended Life Cycle Support, Pay-As-You-Go",
    "subtitle_rhel-x86-els-payg": "$t(curiosity-view.subtitle_RHEL)",
    "description_rhel-x86-els-payg": "Monitor your RHEL ELS PAYG usage for cloud provider subscriptions."
  }
}
```

## Key Differences: PAYG vs Annual Variants

### PAYG Variant Characteristics
1. **Display Type**: Uses `DISPLAY_TYPES.HOURLY` instead of `DISPLAY_TYPES.CAPACITY`
2. **Metrics**: Typically focuses on `VCPUS` instead of `CORES` or `SOCKETS`
3. **Naming**: Includes "PAYG", "Pay-As-You-Go", or "On-Demand" in names
4. **Configuration File**: Requires a dedicated product configuration file
5. **Billing**: References cloud provider billing accounts
6. **Description**: Emphasizes monitoring usage for cloud provider subscriptions

### Annual Variant Characteristics
1. **Display Type**: Uses `DISPLAY_TYPES.CAPACITY`
2. **Metrics**: Typically focuses on `CORES` and `SOCKETS`
3. **Naming**: Includes "Annual" in names
4. **Configuration**: Often shares base RHEL configuration with minor customizations
5. **Billing**: References standard subscription models
6. **Description**: Emphasizes tracking usage against subscription thresholds

## File Checklist

- [ ] Add variant constant to appropriate section in `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (all 3+ locations)
- [ ] Create product configuration file `src/config/product.yourVariantName.js`
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` to update test snapshots
- [ ] Run `npm run test:lintfix` to format code
- [ ] Run `npm run test:ci` to verify all tests pass

## Common Pitfalls

❌ **Don't:**
- Forget to update ALL JSDoc type annotations
- Skip creating a dedicated product configuration file
- Use inconsistent naming conventions
- Forget to set `productDisplay: DISPLAY_TYPES.HOURLY`
- Miss updating the variant group in `productVariants` array

✅ **Do:**
- Follow alphabetical ordering in all locations
- Use consistent naming patterns for similar variant types
- Create a complete product configuration file
- Include appropriate PAYG terminology in localization
- Verify all tests pass before committing

## Troubleshooting Guide

### Common Issues and Solutions

1. **Wrong Display Type**
   - **Issue**: PAYG variant shows capacity metrics instead of hourly
   - **Solution**: Ensure `productDisplay: DISPLAY_TYPES.HOURLY` is set

2. **Missing Variant Group**
   - **Issue**: Variant not appearing in selection dropdowns
   - **Solution**: Verify `productVariants` array includes the right variant group

3. **Metric Display Issues**
   - **Issue**: Wrong metric displayed (e.g., Cores instead of vCPUs)
   - **Solution**: Check `initialGraphFilters` and `initialInventoryFilters` for correct metrics

4. **Cloud Provider Details Missing**
   - **Issue**: Billing provider information not showing
   - **Solution**: Ensure inventory filters include the `BILLING_PROVIDER` metric

5. **Test Failures**
   - **Issue**: Tests fail after adding PAYG variant
   - **Solution**: Check for duplicate IDs, missed JSDoc updates, or snapshot mismatches

## Integration Points

The RHEL PAYG variant configuration integrates with:
- **Constants**: Used throughout the application to identify products
- **Localization**: Determines how the variant appears in the UI
- **Router**: Used for URL routing based on product ID
- **API Integration**: Product ID must match backend expectations
- **Billing Integration**: Connects with cloud provider billing information
- **Metrics**: Uses hourly usage metrics appropriate for PAYG products

## Testing Strategy

1. **Unit Tests**: Verify constants and snapshots update correctly
2. **Integration Testing**: Ensure the new variant appears in navigation
3. **Manual Testing**: Verify UI displays the correct labels, metrics, and charts
4. **API Testing**: Confirm backend recognizes the variant ID and returns hourly metrics
5. **Billing Provider Testing**: Verify cloud provider details display correctly

## Maintenance Guidelines

- **Naming Consistency**: Follow established patterns for similar PAYG variants
- **Metric Consistency**: Use vCPUs or appropriate hourly metrics for all PAYG variants
- **Documentation**: Update relevant documentation if adding a new variant type
- **Code Reviews**: Pay close attention to display type, metrics, and billing provider integrations

## Related Documentation

- See `guidelines/project-workflows/adding-openshift-product.md` for similar hourly product configuration patterns
- See `guidelines/project-workflows/adding-rhel-annual-variant.md` for contrast with annual variants
- Review existing RHEL PAYG variants in the codebase for naming conventions
- Check the backend API documentation for supported product IDs
