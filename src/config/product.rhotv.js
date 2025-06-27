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
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chartHelpers';
import { dateHelpers, helpers } from '../common';
import { translate } from '../components/i18n/i18n';

/**
 * Red Hat OpenShift Test Vision
 *
 * @memberof Products
 * @module RHOTV
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
const productId = RHSM_API_PATH_PRODUCT_TYPES.RHOTV;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHOTV;

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
  aliases: ['test', 'vision', 'batman', 'openshift-test'],
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
      metric: RHSM_API_PATH_METRIC_TYPES.MANAGED_NODES,
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
    ]
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
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/openshift/rhotv/${instanceId}`}
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
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => <DateFormat date={lastSeen} type="relative" />,
      isSort: true
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.MANAGED_NODES,
      isSort: true
    }
  ],
  initialInventorySettings: {},
  initialToolbarFilters: []
};

export { config as default, config, productGroup, productId, productLabel };
