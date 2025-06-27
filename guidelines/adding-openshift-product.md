---
priority: 3
context: ["openshift", "product-config", "hourly", "on-demand", "payg", "pay as you go", "create openshift on-demand", "create openshift hourly", "create openshift payg"]
---

# Adding OpenShift Hourly/On-Demand Products

This guide provides step-by-step instructions for adding new OpenShift hourly or on-demand product configurations to the curiosity-frontend application.

## Overview

OpenShift products in this application are configured as hourly billing products that track usage metrics like cores, vCPUs, and instance hours. They typically belong to the "openshift" product group and use `DISPLAY_TYPES.HOURLY` for billing display.

## Interactive Configuration Process

When asked to **"create openshift on-demand OR hourly"** configuration, respond by asking these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product id?"** - The API identifier for the product (e.g., "rhacs", "rhods")
2. **"What is the product long, or full, name?"** - The complete display name (e.g., "Red Hat Advanced Cluster Security")  
3. **"What is the product short name?"** - The abbreviated display name (e.g., "RHACS")
4. **"Is there an existing product variant config that matches what you want?"** - If the answer is no, ask: **"What metric needs to be displayed?"** (e.g., "Cores", "vCPUs", "Instance-hours")

## Step-by-Step Implementation

### Step 1: Add Product Constant

Add the new product ID to `src/services/rhsm/rhsmConstants.js`:

```javascript
const RHSM_API_PATH_PRODUCT_TYPES = {
  // ... existing products ...
  YOUR_PRODUCT: 'your-product-id',
  // ... rest of products in alphabetical order ...
};
```

**Requirements:**
- Use UPPER_SNAKE_CASE for the constant name
- Use kebab-case or the exact API identifier for the value
- Maintain alphabetical ordering within the object

### Step 2: Update JSDoc Type Annotations

Update all JSDoc type annotations in `rhsmConstants.js` to include the new product:

```javascript
/**
 * @type {{RHEL_ARM: string, YOUR_PRODUCT: string, OPENSHIFT: string, ...}}
 */
```

**Locations to update:**
- `RHSM_API_PATH_PRODUCT_TYPES` JSDoc annotation
- All combined type annotations that include product types (typically 4 locations)

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

**Important:** ESLint may make formatting changes to JSDoc comments (line wrapping) which are acceptable. However, **revert any unrelated changes** that ESLint makes, such as:
- Converting line comments (`//`) to block comments (`/* */`) 
- Modifying unrelated code sections
- Changes to parts of the file not related to your product addition

**Focus only on changes directly related to the new product.**

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

## Example Implementation

Based on RHACS (Red Hat Advanced Cluster Security):
- Product ID: `rhacs`
- Full Name: "Red Hat Advanced Cluster Security" 
- Short Name: "RHACS"
- Metric: Cores
- Display Type: Hourly
- Aliases: `['advanced', 'cluster', 'security', 'kubernetes', 'acs']`

The configuration automatically becomes available through the product discovery system without additional registration steps. 