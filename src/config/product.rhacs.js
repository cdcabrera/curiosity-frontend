import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES as SUBSCRIPTIONS_INVENTORY_META_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chart';
import { dateHelpers, helpers } from '../common';
import { SelectPosition } from '../components/form/select';
import { translate, EMPTY_CONTEXT } from '../components/i18n/i18n';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.RHACS;

const productId = RHSM_API_PATH_PRODUCT_TYPES.RHACS;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHACS;

const config = {
  aliases: ['advanced', 'cluster', 'security', 'kubernetes', 'acs'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.HOURLY,
  viewId: `view${productGroup}`,
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
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
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
      id: INVENTORY_TYPES.DISPLAY_NAME,
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {}, [INVENTORY_TYPES.INSTANCE_ID]: instanceId = {} },
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
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/application-services/acs/instances/instance/${instanceId}`}
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
      id: INVENTORY_TYPES.BILLING_PROVIDER,
      cell: ({ [INVENTORY_TYPES.BILLING_PROVIDER]: provider }) =>
        translate(`curiosity-inventory.label_${INVENTORY_TYPES.BILLING_PROVIDER}`, {
          context: provider || 'none'
        }),
      isSort: true,
      isWrap: false,
      width: 15
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.CORES,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: RHSM_API_PATH_METRIC_TYPES.CORES,
          total: helpers.numberDisplay(total)?.format({ mantissa: 5, trimMantissa: true }) || 0
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      id: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen }) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
  initialInventorySettings: {
    guestContent: ({
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {},
      [INVENTORY_TYPES.INSTANCE_ID]: id
    } = {}) => (numberOfGuests > 0 && id) || undefined
  },
  initialSubscriptionsInventoryFilters: [
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME,
      isSortable: true,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.BILLING_PROVIDER,
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.BILLING_PROVIDER]: provider }) =>
        translate(`curiosity-inventory.label`, {
          context: [SUBSCRIPTIONS_INVENTORY_TYPES.BILLING_PROVIDER, provider?.value || 'none']
        }),
      isSortable: true,
      isWrappable: false,
      cellWidth: 15
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY,
      isSortable: true,
      cellWidth: 10,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_META_TYPES.SUBSCRIPTION_TYPE,
      cell: (data, session, { [SUBSCRIPTIONS_INVENTORY_META_TYPES.SUBSCRIPTION_TYPE]: subscriptionType } = {}) =>
        translate(`curiosity-inventory.label_${SUBSCRIPTIONS_INVENTORY_META_TYPES.SUBSCRIPTION_TYPE}`, {
          context: subscriptionType || EMPTY_CONTEXT
        }),
      isSortable: false,
      cellWidth: 15,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE,
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: nextEventDate } = {}) =>
        (nextEventDate?.value &&
          helpers.isDate(nextEventDate?.value) &&
          moment.utc(nextEventDate?.value).format('YYYY-MM-DD')) ||
        '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER
    },
    {
      id: 'rangedMonthly',
      isSecondary: true,
      position: SelectPosition.right
    }
  ]
};

export { config as default, config, productGroup, productId };
