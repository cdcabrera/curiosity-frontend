import React from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { translate } from '../components/i18n/i18n';
// import { RHSM_API_PATH_PRODUCT_TYPES } from '../services/rhsm/rhsmConstants';

/**
 * Global banner configurations.
 *
 * @example Maintenance banner, add object to the banners list
 * {
 *   id: 'global-maintenance-banner',
 *   // Reference your locale identifiers only
 *   title: () => translate('curiosity-banner.maintenance_title'),
 *   message: () => translate('curiosity-banner.maintenance_description'),
 *
 *   // The type of banner (affects color)
 *   variant: AlertVariant.info,
 *
 *   // Help automated testing
 *   dataTest: 'bannerMaintenance',
 *
 *   // Optional: Add remove associated products via their IDs.
 *   // Remove the entire property to active for all products
 *   productIds: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86],
 *
 *   // Optional: Logic to determine if banner should show
 *   // Remove the entire property to always be active
 *   condition: ({ state, productId }) => state.someGlobalFlag === true,
 *   // Buttons/Actions configuration
 *   actions: [
 *     {
 *       title: () => translate('curiosity-banner.maintenance_action_learn_more'),
 *       href: 'https://status.redhat.com',
 *       variant: 'link', // or 'primary', 'secondary', etc.
 *       isExternal: true
 *     }
 *   ]
 * }
 *
 * @type {Array<{id: string, title: string, message: string, variant: string, dataTest: string,
 *     productIds: string[], condition: Function, actions: Array<{title: string, href: string,
 *     onClick: Function, isExternal: boolean}>}>}
 */
const banners = [
  {
    id: 'global-notifications-banner',
    title: () => translate('curiosity-banner.notifications_title'),
    message: () => translate('curiosity-banner.notifications_description', {}, [<strong />]),
    variant: AlertVariant.custom,
    dataTest: 'bannerNotifications',
    condition: () => new Date().getTime() <= new Date('May 2, 2026').getTime(),
    actions: [
      {
        title: () => translate('curiosity-banner.notifications_action_setup'),
        href: 'https://console.redhat.com/settings/notifications/user-preferences?bundle=subscription-services&app=subscriptions',
        variant: 'link',
        isExternal: true
      },
      {
        title: () => translate('curiosity-banner.learn_more'),
        href: 'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html-single/getting_started_with_the_subscriptions_service/index#proc-notifications-subscription-usage',
        variant: 'link',
        isExternal: true
      }
    ]
  }
];

export { banners as default, banners };
