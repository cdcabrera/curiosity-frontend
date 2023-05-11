import React from 'react';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
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
import { dateHelpers, helpers } from '../common';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.ROSA;

const productId = RHSM_API_PATH_PRODUCT_TYPES.ROSA;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.ROSA;

const config = {
  aliases: [],
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
  initialGraphFilters: undefined,
  initialGraphSettings: {},
  initialInventoryFilters: [
    {
      id: INVENTORY_TYPES.DISPLAY_NAME,
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {}, [INVENTORY_TYPES.INSTANCE_ID]: instanceId = {} },
        session
      ) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!instanceId.value) {
          return displayName.value;
        }

        let updatedDisplayName = displayName.value || instanceId.value;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${instanceId.value}/`}
            >
              {displayName.value || instanceId.value}
            </Button>
          );
        }

        return updatedDisplayName;
      },
      isSortable: true
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.CORES,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: RHSM_API_PATH_METRIC_TYPES.CORES,
          total: helpers.numberDisplay(total?.value)?.format({ mantissa: 5, trimMantissa: true }) || 0
        }),
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen }) =>
        (lastSeen?.value && <DateFormat date={lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialSubscriptionsInventoryFilters: undefined,
  initialToolbarFilters: [
    {
      id: 'rangedMonthly',
      isSecondary: true,
      position: SelectPosition.right
    }
  ]
};

export { config as default, config, productGroup, productId };