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
  key_concepts: ["openshift", "product-config", "hourly", "on-demand", "payg", "pay as you go"]
  related_guidelines: ["guidelines/project-workflows/adding-rhel-annual-variant.md", "guidelines/project-workflows/adding-rhel-payg-variant.md", "guidelines/project-workflows/adding-new-product.md"]
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding an OpenShift product"
---

# Adding OpenShift Hourly/On-Demand Products

This guide provides step-by-step instructions for adding new OpenShift hourly or on-demand product configurations to the curiosity-frontend application.

## Overview

OpenShift products in this application are configured as hourly billing products that track usage metrics like cores, vCPUs, and instance hours. They typically belong to the "openshift" product group and use `DISPLAY_TYPES.HOURLY` for billing display.

## Interactive Configuration Process

When asked to **"create openshift on-demand OR hourly"**, **"add an openshift product"**, or **"create an openshift product"**, you MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product id?"** - The API identifier for the product (e.g., "rhacs", "rhods")
2. **"What is the product long, or full, name?"** - The complete display name (e.g., "Red Hat Advanced Cluster Security")
3. **"What is the product short name?"** - The abbreviated display name (e.g., "RHACS")
4. **"Is there an existing product variant config that matches what you want?"**
  - If **no**: Continue to question 6
  - If **yes**: Continue to question 5
5. **"What existing product config matches what you want?"** - Specify which existing config to use as template (e.g., "rhacs", "rhods", "rosa")
6. **"What metric needs to be displayed?"** - The primary metric for charts and inventory (e.g., "Cores", "vCPUs", "Instance-hours")
7. **"Is the metric display name unique?"** - Does the technical metric need to display differently to users?
  - If **yes**: "What should the metric display as?" (e.g., technical: "Cores" → display: "vCPUs")
  - If **no**: Use the standard metric display name

**Note:** Even when using an existing config as template, you should still ask about metrics since customization may be needed.

**Important:** Questions 6 and 7 are closely related - the metric question determines the technical API metric, while the display name question determines how it appears to users.

## Step-by-Step Implementation

### Step 1: Add Product Constant

Add the new product ID to `src/services/rhsm/rhsmConstants.js` in alphabetical order:

```javascript
const RHSM_API_PATH_PRODUCT_TYPES = {
  ...RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  ...RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES,
  ...RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES,
  ANSIBLE: 'ansible-aap-managed',
  EXAMPLE_SECURITY: 'example-security',  // <-- Add your product here
  RHACM: 'rhacm',
  RHACS: 'rhacs',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  // ... rest of products in alphabetical order ...
};
```

**Requirements:**
- Use UPPER_SNAKE_CASE for the constant name
- Use kebab-case or the exact API identifier for the value
- Maintain alphabetical ordering within the object

### Step 2: Update JSDoc Type Annotations

Update all JSDoc type annotations in `rhsmConstants.js` to include the new product. Find these 4 locations:

**Location 1: Main product types JSDoc**
```javascript
/**
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, RHEL_X86_ELS_UNCONVERTED: string,
 *     RHEL_WORKSTATION: string, EXAMPLE_SECURITY: string, RHODS: string, ROSA: string,
 *     RHEL_COMPUTE_NODE: string, OPENSHIFT: string, RHACM: string, RHACS: string}}
 */
```

**Location 2-4: Combined type annotations**
Search for large JSDoc blocks that list all product types and add your product in alphabetical order.

### Step 3: Create Product Configuration File

Create `src/config/product.yourProduct.js` using this template:

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
const productGroup = 'openshift';

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
const productLabel = RHSM_API_PATH_PRODUCT_TYPES.YOUR_PRODUCT;

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
  aliases: ['alias1', 'alias2'], // Optional: add relevant aliases
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY,
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
      metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Use appropriate metric
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
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId } = {},
        session
      ) => {
        const { inventory: authorized } = session?.authorized || {};

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
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/your-product-url/${instanceId}`}
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
      width: 15
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Use appropriate metric
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: (total && RHSM_API_PATH_METRIC_TYPES.CORES) || undefined,
          total: helpers.numberDisplay(total)?.format({ mantissa: 5, trimMantissa: true }),
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.CORES}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen }) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      width: 15
    }
  ]
};

export { config as default, config };
```

### Step 4: Add Localization Entries

Add entries to `public/locales/en-US.json`:

```json
{
  "curiosity-view": {
    "title_your-product-id": "Your Product Full Name",
    "subtitle_your-product-id": "Your Product Short Name",
    "description_your-product-id": "Brief description of the product"
  }
}
```

#### Special Case: Custom Metric Display Names

**Important Business Requirement:** Some products need to display a different metric name to users while keeping the technical metric unchanged.

**This requirement is captured in Question 7** of the interactive flow: *"Is the metric display name, or names, unique? If yes, what is the new display name, or names?"*

**Example Scenario:** A hypothetical product uses the `Cores` metric technically, but needs to display "vCPU" to users for business/marketing reasons.

When this is needed:
1. Keep the metric as `RHSM_API_PATH_METRIC_TYPES.CORES` in your product config
2. Update ALL locale strings to use the customer-facing term:

```json
{
  "cardHeading_Cores_yourProduct": "vCPU hour usage",
  "cardHeadingDescription_Cores_yourProduct": "vCPU hours usage in hours", 
  "cardBodyMetric_total_Cores_prepaid_yourProduct": "<0>{{total}}</0> vCPU hours",
  "label_threshold_Cores_yourProduct": "Pre-paid vCPU subscription threshold",
  "legendTooltip_threshold_Cores_yourProduct": "Maximum capacity, as vCPU hours, based on total [Product Name] pre-paid subscriptions in this account.",
  "header_Cores_yourProduct": "vCPU hours"
}
```

**Common Use Cases:**
- Technical metric: `Cores` → User display: "vCPU"
- Technical metric: `Sockets` → User display: "CPU"
- Technical metric: `Instance-hours` → User display: "Control plane hours"

This ensures the API uses the correct technical metric while presenting user-friendly terminology.

### Step 5: Update Jest Snapshots

Run the test suite to update snapshots:

```bash
npm run test:ci -- --updateSnapshot
```

### Step 6: Run ESLint Fix

Apply code formatting and linting fixes using the project's npm script:

```bash
npm run test:lintfix
```

**⚠️ Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes, such as:
- Converting line comments (`//`) to block comments (`/* */`)
- **Lines 287-290 in `rhsmConstants.js`**: Billing provider comment formatting changes
- Modifying unrelated code sections
- Changes to parts of the file not related to your product addition

**Focus only on changes directly related to the new product.**

**Example of unrelated change to revert:**
```javascript
// BEFORE (correct):
  // ORACLE: 'oracle',
  // NONE: ''

// AFTER ESLint (incorrect - revert this):
  /*
   * ORACLE: 'oracle',
   * NONE: ''
   */
```

### Step 7: Run Tests

Verify all tests pass:

```bash
npm run test:ci
```

## Configuration Options

### Display Types
- `DISPLAY_TYPES.HOURLY` - For hourly billing products (most OpenShift products)
- `DISPLAY_TYPES.CAPACITY` - For capacity-based products (RHACM, ROSA)

### Common Metrics
- `RHSM_API_PATH_METRIC_TYPES.CORES` - CPU cores
- `RHSM_API_PATH_METRIC_TYPES.VCPUS` - Virtual CPUs
- `RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS` - Instance hours
- `RHSM_API_PATH_METRIC_TYPES.MANAGED_NODES` - Managed nodes

### Chart Types
- `ChartTypeVariant.line` - Line chart (most common for hourly)
- `ChartTypeVariant.threshold` - Threshold line
- Use `filters` array for capacity products with prepaid/on-demand categories

## File Checklist

- [ ] Add product constant to `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (4 locations in rhsmConstants.js)
- [ ] Create product configuration file `src/config/product.yourProduct.js`
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` - Update Jest snapshots
- [ ] Run `npm run test:lintfix` - Format code
- [ ] Run `npm run test:ci` - Verify all tests pass

## Common Pitfalls

❌ **Don't:**
- Forget to update JSDoc type annotations
- Use inconsistent naming conventions
- Skip the alphabetical ordering in constants
- Copy capacity-based configurations for hourly products
- Forget to update localization entries

✅ **Do:**
- Use appropriate display type (`HOURLY` vs `CAPACITY`)
- Follow existing naming patterns for consistency
- Include proper inventory URL links for your product
- Test thoroughly before committing
- Use the correct metric types for your product

## Integration Points

The product configuration integrates with:
- **Router**: Uses `productPath` for URL routing
- **API Services**: Uses `productId` for API calls
- **Localization**: Uses product ID for translation keys
- **Charts**: Uses metric types and display settings
- **Inventory**: Uses inventory filters and sorting

## Testing Strategy

1. **Unit Tests**: Snapshots will capture structural changes
2. **Integration Testing**: Verify product appears in navigation
3. **Manual Testing**: Check charts, inventory, and localization
4. **API Testing**: Verify correct API calls are made

## Complete Implementation Examples

### Example A: Single Metric Product (Security Service)

**Step 1: Add to rhsmConstants.js**
```javascript
const RHSM_API_PATH_PRODUCT_TYPES = {
  // ... existing products ...
  EXAMPLE_SECURITY: 'example-security',
  // ... rest of products ...
};
```

**Step 2: Create product.exampleSecurity.js**
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
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chartHelpers';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { translate } from '../components/i18n/i18n';

const productGroup = 'openshift';
const productId = RHSM_API_PATH_PRODUCT_TYPES.EXAMPLE_SECURITY;
const productLabel = RHSM_API_PATH_PRODUCT_TYPES.EXAMPLE_SECURITY;

const config = {
  aliases: ['security', 'protection', 'scan'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY,
  viewId: `view${productGroup}-${productId}`,
  onloadProduct: [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID],
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  initialGraphFilters: [
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],
  initialInventoryFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      cell: ({ [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId } = {}, session) => {
        const { inventory: authorized } = session?.authorized || {};
        if (!instanceId) return displayName;

        let updatedDisplayName = displayName || instanceId;
        if (authorized) {
          updatedDisplayName = (
            <Button isInline component="a" variant="link" href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/security/${instanceId}`}>
              {updatedDisplayName}
            </Button>
          );
        }
        return updatedDisplayName;
      },
      isSort: true
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: (total && RHSM_API_PATH_METRIC_TYPES.CORES) || undefined,
          total: helpers.numberDisplay(total)?.format({ mantissa: 5, trimMantissa: true }),
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.CORES}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    }
  ]
};

export { config as default, config };
```

**Step 3: Add to locales/en-US.json**
```json
{
  "curiosity-view": {
    "title_example-security": "Red Hat OpenShift Security Service",
    "subtitle_example-security": "Security Service",
    "description_example-security": "Monitor your OpenShift Security Service usage for PAYG subscriptions."
  }
}
```

### Example B: Multi-Metric Product (Compute Service)

**Key differences for multi-metric products:**

```javascript
// Multiple chart filters with different colors
initialGraphFilters: [
  {
    metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
    fill: chartColorBlueLight.value,
    stroke: chartColorBlueDark.value,
    color: chartColorBlueDark.value,
    chartType: ChartTypeVariant.line,
    isStacked: false,
    yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
  },
  {
    metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
    fill: chartColorGoldLight.value,
    stroke: chartColorGoldDark.value,
    color: chartColorGoldDark.value,
    chartType: ChartTypeVariant.line,
    isStacked: false,
    yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
  }
],

// Multiple inventory columns
initialInventoryFilters: [
  // ... standard filters (display name, billing provider, last seen) ...
  {
    metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
    cell: ({ [RHSM_API_PATH_METRIC_TYPES.VCPUS]: total }) =>
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
    metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
    cell: ({ [RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS]: total }) =>
      translate('curiosity-inventory.measurement', {
        context: (total && RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS) || undefined,
        total: helpers.numberDisplay(total)?.format({ mantissa: 5, trimMantissa: true }),
        testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS}`} data-value={`${total}`} />
      }),
    isSort: true,
    isWrap: true,
    width: 15
  }
]
```

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Tests fail after adding product**
- **Cause**: Missing JSDoc updates or snapshot mismatches
- **Solution**: Ensure all 4 JSDoc locations are updated, run `npm run test:ci -- --updateSnapshot`

**Issue: ESLint changes unrelated code**
- **Cause**: ESLint auto-formatting affects other parts of the file
- **Solution**: Review git diff carefully, revert changes to lines 287-290 and other unrelated sections

**Issue: Product doesn't appear in navigation**
- **Cause**: File naming or export issues
- **Solution**: Ensure file is named `product.yourProductId.js` and exports are correct

**Issue: Localization keys not working**
- **Cause**: Missing or incorrect translation keys
- **Solution**: Verify keys match pattern `title_productId`, `subtitle_productId`, `description_productId`

**Issue: API calls failing**
- **Cause**: Product ID doesn't match backend expectations
- **Solution**: Verify product ID matches exactly what the RHSM API expects

### Validation Checklist

Before submitting your changes, verify:

- [ ] **Constants**: Product constant added in alphabetical order
- [ ] **JSDoc**: All 4 type annotations updated with new product
- [ ] **Configuration**: Product file created with correct naming convention
- [ ] **Localization**: All 3 translation keys added (title, subtitle, description)
- [ ] **Metrics**: Correct metrics configured for both charts and inventory
- [ ] **Colors**: Appropriate chart colors selected (different colors for multiple metrics)
- [ ] **Tests**: All tests passing, snapshots updated
- [ ] **ESLint**: Only product-related changes remain after linting
- [ ] **Git Diff**: Review changes to ensure no unrelated modifications

## Real-World Examples

### Example 1: Single Metric Product (RHACS)
- **Product ID**: `rhacs`
- **Full Name**: "Red Hat Advanced Cluster Security"
- **Short Name**: "RHACS"
- **Metric**: Cores
- **Display Type**: Hourly
- **Aliases**: `['advanced', 'cluster', 'security', 'kubernetes', 'acs']`

### Example 2: Multi-Metric Product (Hypothetical PAYG Product)
- **Product ID**: `example-payg`
- **Full Name**: "Red Hat OpenShift Example Service"
- **Short Name**: "OpenShift Example"
- **Metrics**: vCPUs and Instance Hours
- **Display Type**: Hourly
- **Chart Colors**: Blue for vCPUs, Gold for Instance Hours

### Example 3: Capacity Product (RHACM)
- **Product ID**: `rhacm`
- **Display Type**: Capacity (not Hourly)
- **Features**: Prepaid/On-demand filtering
- **Metric**: vCPUs

## Advanced Configuration

### Custom Inventory URLs

Update the inventory display name cell to link to your product's specific console:

```javascript
{
  metric: INVENTORY_TYPES.DISPLAY_NAME,
  cell: (
    { [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId } = {},
    session
  ) => {
    const { inventory: authorized } = session?.authorized || {};

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
          href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/your-product-path/${instanceId}`}
        >
          {updatedDisplayName}
        </Button>
      );
    }

    return updatedDisplayName;
  },
  isSort: true
}
```

### Product Aliases

Add meaningful aliases to help with search and discovery:

```javascript
aliases: [
  'short-name',      // Product abbreviation
  'common-term',     // How users commonly refer to it
  'category',        // Product category
  'technology',      // Underlying technology
  'alternative-name' // Alternative names or acronyms
]
```

**Examples:**
- RHACS: `['advanced', 'cluster', 'security', 'kubernetes', 'acs']`
- RHODS: `['data', 'science', 'ml', 'machine-learning', 'ai']`
- ROSA: `['managed', 'aws', 'cloud']`

The configuration automatically becomes available through the product discovery system without additional registration steps.

## Git Workflow Best Practices

### Before Starting
1. **Create a feature branch** from the main branch
2. **Pull latest changes** to ensure you're working with current code
3. **Check existing products** to understand patterns and conventions

### During Development
1. **Make atomic commits** - separate logical changes into different commits
2. **Test frequently** - run tests after each major change
3. **Review diffs carefully** - especially after ESLint runs

### Before Committing
1. **Run the full test suite**: `npm run test:ci`
2. **Check git diff**: `git diff` - ensure only intended changes are included
3. **Verify ESLint changes**: Revert any unrelated formatting changes
4. **Test manually**: Verify the product appears and functions correctly

### Commit Message Format
```
feat(openshift): add RHDS product configuration

- Add RHDS product constant and JSDoc annotations
- Create product.yourProduct.js with vCPUs and Instance Hours metrics
- Add localization entries for Red Hat OpenShift Dolor Sit
- Update Jest snapshots for new product configuration

Closes: #[issue-number]
```

### Files That Should Change
**Expected changes:**
- `src/services/rhsm/rhsmConstants.js` - Product constant and JSDoc
- `src/config/product.yourProduct.js` - New product configuration
- `public/locales/en-US.json` - Localization entries
- Various `__snapshots__/*.snap` files - Test snapshots

**Files that should NOT change:**
- Unrelated product configurations
- Billing provider constants (lines 287-290 in rhsmConstants.js)
- Other localization files
- Any files not directly related to your product

## Maintenance and Cleanup

### Removing a Product Configuration

If you need to remove a product configuration in the future:

1. **Remove the product constant** from `rhsmConstants.js`
2. **Update JSDoc annotations** to remove the product type
3. **Delete the product configuration file** (`src/config/product.yourProduct.js`)
4. **Remove localization entries** from `en-US.json`
5. **Update snapshots** with `npm run test:ci -- --updateSnapshot`
6. **Run tests** to ensure no broken references remain

### Documentation Independence

This guide uses **hypothetical examples** (`example-security`, `example-payg`) that don't correspond to real files in the codebase. This ensures:

- ✅ Documentation remains valid even if specific product files are removed
- ✅ Examples are clear and educational without depending on production code
- ✅ Developers can follow examples without conflicts with existing products

### Long-term Maintenance

When maintaining these guidelines:

- **Use generic examples** rather than referencing specific product implementations
- **Keep inline code examples complete** and self-contained
- **Update troubleshooting** based on new issues discovered
- **Validate examples** periodically to ensure they still work with current codebase structure
