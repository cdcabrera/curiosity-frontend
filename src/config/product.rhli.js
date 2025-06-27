import React from 'react';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import { chartColorBlueLight, chartColorBlueDark } from '../common/tokenHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chart';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { translate } from '../components/i18n/i18n';

/**
 * RHLI
 *
 * @memberof Products
 * @module RHLI
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
const productId = RHSM_API_PATH_PRODUCT_TYPES.RHLI;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHLI;

/**
 * Product configuration
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string, onloadProduct: Array,
 *     inventorySubscriptionsQuery: object, query: object, initialSubscriptionsInventoryFilters: Array,
 *     initialInventorySettings: object, viewId: string, initialToolbarFilters: Array, productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string, initialGraphFilters: Array,
 *     initialGraphSettings: object, initialInventoryFilters:
 *     Array}}
 */
const config = {
  aliases: ['lorem', 'ipsum', 'text', 'sample', 'placeholder'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY,
  viewId: `view${productGroup}-${productId}`,
  onloadProduct: [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID],
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_SET_TYPES.USE_RUNNING_TOTALS_FORMAT]: true
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: RHSM_API_QUERY_INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
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
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/lorem-ipsum/${instanceId}`}
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
      width: 15
    }
  ]
};

export { config as default, config };
