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
  related_guidelines: ["guidelines/adding-rhel-annual-variant.md", "guidelines/adding-rhel-payg-variant.md"]
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding an OpenShift product"
  trigger_prefixes: ["/workflow add openshift", "/workflow openshift"]
---

# Adding OpenShift Hourly/On-Demand Products

This guide provides step-by-step instructions for adding new OpenShift hourly or on-demand product configurations to the curiosity-frontend application.

## Overview

OpenShift products in this application are configured as hourly billing products that track usage metrics like cores, vCPUs, and instance hours. They typically belong to the "openshift" product group and use either `DISPLAY_TYPES.HOURLY` for hourly billing products or `DISPLAY_TYPES.CAPACITY` for capacity-based products with prepaid/on-demand usage.

## Interactive Configuration Process

You MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product id?"** - The API identifier for the product (e.g., "rhacs", "rhods", "rosa")
2. **"What is the product long, or full, name?"** - The complete display name (e.g., "Red Hat Advanced Cluster Security")
3. **"What is the product short name?"** - The abbreviated display name (e.g., "RHACS")
4. **"What is the product display type?"** - Either "hourly" for HOURLY products or "capacity" for CAPACITY products with prepaid/on-demand metrics
5. **"Is there an existing product variant config that matches what you want?"**
  - If **no**: Continue to question 7
  - If **yes**: Continue to question 6
6. **"What existing product config matches what you want?"** - Specify which existing config to use as template (e.g., "rhacs", "rhods" for HOURLY or "rosa", "rhacm" for CAPACITY)
7. **"What metric or metrics need to be displayed?"** - The primary metric(s) for charts and inventory (e.g., "Cores", "vCPUs", "Instance-hours")
8. **"Are the metric display names unique?"** - Do any technical metrics need to display differently to users?
  - If **yes**: "What should each metric display as?" (e.g., technical: "Cores" → display: "vCPUs")
  - If **no**: Use the standard metric display names

**Note:** Even when using an existing config as template, you should still ask about metrics since customization may be needed.

**Important:** Questions 7 and 8 are closely related - the metric question determines the technical API metrics, while the display name question determines how they appear to users.

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
  RHODS: 'rhods',
  ROSA: 'rosa',
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

Create `src/config/product.yourProduct.js` using this template. This example is for a standard hourly product with a single metric (based on RHACS-like configuration):

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
  aliases: ['alias1', 'alias2'], // Add relevant aliases for product discovery
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY, // Use HOURLY for standard hourly billing products
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
      metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Use appropriate metric (CORES, VCPUS, INSTANCE_HOURS)
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
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/details/${instanceId}`} // Standard OpenShift path
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
      metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Use appropriate metric (CORES, VCPUS, INSTANCE_HOURS)
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
      isWrap: true,
      width: 15
    }
  ],
  initialInventorySettings: {
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
      }
    ]
  },
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER
    },
    {
      id: 'rangedMonthly',
      isSecondary: true,
      position: SelectPosition.right
    },
    {
      id: 'export',
      isItem: true
    }
  ]
};

export { config as default, config, productGroup, productId };
```

### Alternate Template for Capacity-Based Products

If your product uses `DISPLAY_TYPES.CAPACITY` with prepaid/on-demand metrics (like RHACM or ROSA), use this template instead:

```javascript
// Top imports and header documentation remain the same

const config = {
  aliases: ['alias1', 'alias2'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY, // Use CAPACITY for prepaid/on-demand products
  viewId: `view${productGroup}-${productId}`,
  onloadProduct: [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID],
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_SET_TYPES.USE_RUNNING_TOTALS_FORMAT]: true // Important for capacity products
  },
  // Other standard query settings remain the same
  initialGraphFilters: [
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Use appropriate metric
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.PREPAID
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Same metric for on-demand
          fill: chartColorGoldLight.value,
          stroke: chartColorGoldDark.value,
          color: chartColorGoldDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.ON_DEMAND
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES, // Same metric for threshold
          chartType: ChartTypeVariant.threshold
        }
      ]
    }
  ],
  initialGraphSettings: {
    cards: [
      {
        header: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardHeadingMetric', {
            context: ['remainingCapacity', dataSets?.[0]?.display?.chartId],
            testId: 'graphRemainingCapacityCard-header'
          }),
        body: ({ dataSets = [] } = {}) =>
          translate(
            'curiosity-graph.cardBodyMetric',
            {
              context: ['total', dataSets?.[0]?.display?.remainingCapacityHasData && dataSets?.[0]?.display?.chartId],
              testId: 'graphRemainingCapacityCard-body',
              total: helpers
                .numberDisplay(dataSets?.[0]?.display?.remainingCapacity)
                ?.format({
                  average: true,
                  mantissa: 2,
                  trimMantissa: true,
                  lowPrecision: false
                })
                ?.toUpperCase()
            },
            [
              <strong
                title={dataSets?.[0]?.display?.remainingCapacity}
                aria-label={dataSets?.[0]?.display?.remainingCapacity}
              />
            ]
          ),
        footer: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardFooterMetric', {
            date: moment
              .utc(dataSets?.[0]?.display?.dailyDate)
              .format(dateHelpers.timestampUTCTimeFormats.yearTimeShort),
            testId: 'graphRemainingCapacityCard-footer'
          })
      }
    ],
    // Rest of settings remain the same
  },
  // Inventory filters remain the same
};
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

**This requirement is captured in Question 8** of the interactive flow: *"Are the metric display names unique? If yes, what should each metric display as?"*

**Example Scenario:** The ROSA product uses the `Cores` metric technically, but displays "vCPU" to users for business/marketing reasons.

When this is needed:
1. Keep the metric as `RHSM_API_PATH_METRIC_TYPES.CORES` in your product config
2. Update ALL locale strings to use the customer-facing term:

```json
{
  "curiosity-graph": {
    "cardHeading_Cores_your-product-id": "vCPU hour usage",
    "cardHeadingDescription_Cores_your-product-id": "vCPU hours usage in hours", 
    "cardBodyMetric_total_Cores_prepaid_your-product-id": "<0>{{total}}</0> vCPU hours",
    "label_threshold_Cores_your-product-id": "Pre-paid vCPU subscription threshold",
    "legendTooltip_threshold_Cores_your-product-id": "Maximum capacity, as vCPU hours, based on total [Product Name] pre-paid subscriptions in this account.",
    "header_Cores_your-product-id": "vCPU hours"
  },
  "curiosity-inventory": {
    "label_Cores_your-product-id": "vCPU hours"
  }
}
```

**Common Use Cases from Existing Products:**
- ROSA/RHACM: Technical metric: `Cores` → User display: "vCPU"
- OpenShift Dedicated: Technical metric: `Cores` but displays without modification
- OpenShift Dedicated: Also uses `Instance-hours` for control plane usage

This ensures the API uses the correct technical metric while presenting user-friendly terminology to the end user.

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
- `DISPLAY_TYPES.HOURLY` - For hourly billing products (RHACS, RHODS, OpenShift Metrics)
- `DISPLAY_TYPES.CAPACITY` - For capacity-based products with prepaid/on-demand usage (RHACM, ROSA)

### Common Metrics
- `RHSM_API_PATH_METRIC_TYPES.CORES` - CPU cores (used by most OpenShift products)
- `RHSM_API_PATH_METRIC_TYPES.VCPUS` - Virtual CPUs (used by RHACM)
- `RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS` - Instance hours (used by OpenShift Dedicated, ROSA)
- `RHSM_API_PATH_METRIC_TYPES.MANAGED_NODES` - Managed nodes (special use cases)

### Chart Types and Configurations
- `ChartTypeVariant.line` - Line chart (used by all hourly products)
- `ChartTypeVariant.threshold` - Threshold line (used by capacity products)
- Standard hourly products use simple metric arrays in `initialGraphFilters`
- Capacity products use nested `filters` arrays with `CATEGORY_TYPES.PREPAID` and `CATEGORY_TYPES.ON_DEMAND`

### Inventory Configuration
- Display name with link to product console
- Billing provider with tooltip
- Metric columns (CORES, VCPUS, INSTANCE_HOURS) 
- Last seen date

## Real-World Product Configurations

### OpenShift Metrics (Hourly Product with Single Metric)
- Display Type: `HOURLY`
- Metric: `CORES`
- Chart: Simple line chart
- Inventory: Display name, billing provider, cores, last seen

### OpenShift Dedicated (Hourly Product with Multiple Metrics)
- Display Type: `HOURLY`
- Metrics: `CORES` and `INSTANCE_HOURS`
- Chart: Two line charts with different colors
- Inventory: Display name, billing provider, cores, instance hours, last seen

### ROSA (Capacity Product with Prepaid/On-Demand)
- Display Type: `CAPACITY`
- Metrics: `CORES` and `INSTANCE_HOURS` with prepaid/on-demand categories
- Chart: Uses threshold line and separate prepaid/on-demand series
- Inventory: Standard columns plus threshold information

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
- Forget to update JSDoc type annotations in all 4 locations
- Use inconsistent naming conventions (stick to existing patterns)
- Skip the alphabetical ordering in constants
- Use capacity-based configurations for hourly products or vice versa
- Forget to update localization entries in all necessary sections
- Use incorrect URL paths in inventory links (should match Red Hat console paths)

✅ **Do:**
- Use appropriate display type (`HOURLY` vs `CAPACITY`) based on billing model
- Follow existing naming patterns from similar products
- Include proper inventory URL links that match Red Hat console paths
- Add descriptive aliases for product discovery
- Test thoroughly before committing
- Export productGroup and productId from your configuration file

## Integration Points

The product configuration integrates with:
- **Router**: Uses `productPath` and `productId` for URL routing
- **API Services**: Uses `productId` for API calls to the RHSM service
- **Localization**: Uses product ID for translation keys in multiple contexts
- **Charts**: Uses metric types and display settings for usage visualization
- **Inventory**: Uses inventory filters for displaying instance data
- **Toolbar**: Uses standard filter configurations for consistent UI

## Testing Strategy

1. **Unit Tests**: Jest snapshots will capture structural changes
2. **Integration Testing**: Verify product appears in navigation and data loads
3. **Manual Testing**: Check charts, inventory, and localization
4. **API Testing**: Verify correct API calls are made with expected parameters
5. **Visual Testing**: Ensure chart colors and displays match design standards

## Troubleshooting Guide

### Common Issues

1. **Product not appearing in navigation**
   - Check export statement includes `productGroup` and `productId`
   - Verify file naming follows `product.yourProductId.js` pattern
   - Ensure constants are properly added to rhsmConstants.js

2. **Charts not displaying data**
   - Verify the metric names match the API's expected metrics
   - Check if custom display names are properly configured
   - Ensure graph filter configuration is correct for the product type

3. **Wrong display names in UI**
   - Check localization entries in en-US.json
   - Verify metric display name customizations are applied consistently

4. **ESLint changes other code**
   - Only accept linting changes related to your product addition
   - Be careful with JSDoc formatting changes

5. **Snapshot tests failing**
   - Run the full update snapshot command
   - Verify the snapshots only include expected changes

## Complete Implementation Examples

### Example A: Single Metric Hourly Product (Based on RHACS)

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
            <Button isInline component="a" variant="link" href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/details/${instanceId}`}>
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
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen }) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
  initialInventorySettings: {
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
      }
    ]
  },
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER
    },
    {
      id: 'rangedMonthly',
      isSecondary: true,
      position: SelectPosition.right
    },
    {
      id: 'export',
      isItem: true
    }
  ]
};

export { config as default, config, productGroup, productId };
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

### Example B: Multi-Metric Product (Based on OpenShift Dedicated)

This example shows a product that tracks both cores and instance hours, similar to OpenShift Dedicated:

```javascript
import { chartColorBlueLight, chartColorBlueDark, chartColorCyanLight, chartColorCyanDark } from '../common/tokenHelpers';
// Other imports remain the same

const config = {
  aliases: ['dedicated', 'openshift-dedicated'],
  productGroup: 'openshift',
  productId: RHSM_API_PATH_PRODUCT_TYPES.EXAMPLE_DEDICATED,
  productLabel: RHSM_API_PATH_PRODUCT_TYPES.EXAMPLE_DEDICATED,
  productPath: 'openshift',
  productDisplay: DISPLAY_TYPES.HOURLY,
  // Standard query settings

  // Multiple chart filters with different colors for each metric
  initialGraphFilters: [
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisChartLabel: ({ id } = {}) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],

  // Standard graph settings

  // Multiple inventory columns - one for each metric
  initialInventoryFilters: [
    // Standard display name and billing provider filters
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total: (total && Number.parseFloat(total).toFixed(2)) || undefined,
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.CORES}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total: (total && Number.parseFloat(total).toFixed(2)) || undefined,
          testId: (
            <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS}`} data-value={`${total}`} />
          )
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    // Last seen column
  ]
};
```

### Example C: Capacity Product (Based on ROSA/RHACM)

```javascript
import { RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES } from '../services/rhsm/rhsmConstants';
// Other imports remain the same

const config = {
  // Standard product information
  productDisplay: DISPLAY_TYPES.CAPACITY,
  // Standard query settings

  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_SET_TYPES.USE_RUNNING_TOTALS_FORMAT]: true // Important for capacity products
  },

  // Capacity products use a nested filter structure with prepaid/on-demand categories
  initialGraphFilters: [
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.PREPAID
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          fill: chartColorGoldLight.value,
          stroke: chartColorGoldDark.value,
          color: chartColorGoldDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.ON_DEMAND
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          chartType: ChartTypeVariant.threshold
        }
      ]
    }
  ],

  // Special graph card settings focused on remaining capacity
  initialGraphSettings: {
    cards: [
      {
        header: ({ dataSets = [] } = {}) =>
          translate('curiosity-graph.cardHeadingMetric', {
            context: ['remainingCapacity', dataSets?.[0]?.display?.chartId],
            testId: 'graphRemainingCapacityCard-header'
          }),
        // Remainder of card settings focused on remaining capacity
      }
    ]
  }
};
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

## Git Reference Commits

For complete implementation details and full context, refer to these actual commits:

### RHACS Implementation
- **Commit Hash**: `4cdbc99221321daaecff3492ceaa39509ff76505`
- **Description**: Add Red Hat Advanced Cluster Security product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

### RHACM Implementation
- **Commit Hash**: `14db2a98717df177474cad171dc673ac3770219c`
- **Description**: Add Red Hat Advanced Cluster Management product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

### RHODS Implementation
- **Commit Hash**: `2ca0496a88618343c2bc1f17fd955a8544f268b3`
- **Description**: Add Red Hat OpenShift Data Science product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

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
