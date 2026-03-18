import { AlertVariant } from '@patternfly/react-core';

/**
 * Global banner configurations.
 * @type {Array<{id: string, title: string, message: string, variant: string, dataTest: string,
 *     productIds: string[], condition: Function, actions: Array<{title: string, href: string,
 *     onClick: Function, isExternal: boolean}>}>}
 */
const banners = [
  /*
  {
    id: 'global-maintenance-banner',
    title: 'curiosity-banner.maintenance_title',
    message: 'curiosity-banner.maintenance_description',
    variant: AlertVariant.info,
    dataTest: 'bannerMaintenance',
    // Associated products via their IDs
    productIds: ['rhel', 'ansible', 'openshift-container'],
    // Optional: Logic to determine if banner should show
    condition: ({ state, productId }) => state.someGlobalFlag === true,
    // Buttons/Actions configuration
    actions: [
      {
        title: 'curiosity-banner.maintenance_action_learn_more',
        href: 'https://status.redhat.com',
        variant: 'link', // or 'primary', 'secondary', etc.
        isExternal: true
      }
    ]
  }
  */
];

export { banners as default, banners };
