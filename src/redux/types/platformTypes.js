import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications';

/**
 * @memberof Types
 * @module PlatformTypes
 */

const PLATFORM_ADD_NOTIFICATION = ADD_NOTIFICATION;
const PLATFORM_REMOVE_NOTIFICATION = REMOVE_NOTIFICATION;
const PLATFORM_CLEAR_NOTIFICATIONS = CLEAR_NOTIFICATIONS;
const PLATFORM_GLOBAL_FILTER_HIDE = 'PLATFORM_GLOBAL_FILTER_HIDE';
const PLATFORM_INIT = 'PLATFORM_INIT';
const PLATFORM_APP_NAME = 'PLATFORM_APP_NAME';
const PLATFORM_ON_NAV = 'PLATFORM_ON_NAV';
const PLATFORM_SET_NAV = 'PLATFORM_SET_NAV';
const PLATFORM_USER_AUTH = 'PLATFORM_USER_AUTH';

/**
 * Platform action, reducer types.
 *
 * @type {{PLATFORM_APP_NAME: string, PLATFORM_USER_AUTH: string, PLATFORM_GLOBAL_FILTER_HIDE: string,
 *     PLATFORM_INIT: string, PLATFORM_SET_NAV: string, PLATFORM_CLEAR_NOTIFICATIONS: string,
 *     PLATFORM_ADD_NOTIFICATION: string, PLATFORM_REMOVE_NOTIFICATION: string, PLATFORM_ON_NAV: string}}
 */
const platformTypes = {
  PLATFORM_ADD_NOTIFICATION,
  PLATFORM_REMOVE_NOTIFICATION,
  PLATFORM_CLEAR_NOTIFICATIONS,
  PLATFORM_GLOBAL_FILTER_HIDE,
  PLATFORM_INIT,
  PLATFORM_APP_NAME,
  PLATFORM_ON_NAV,
  PLATFORM_SET_NAV,
  PLATFORM_USER_AUTH
};

export {
  platformTypes as default,
  platformTypes,
  PLATFORM_ADD_NOTIFICATION,
  PLATFORM_REMOVE_NOTIFICATION,
  PLATFORM_CLEAR_NOTIFICATIONS,
  PLATFORM_GLOBAL_FILTER_HIDE,
  PLATFORM_INIT,
  PLATFORM_APP_NAME,
  PLATFORM_ON_NAV,
  PLATFORM_SET_NAV,
  PLATFORM_USER_AUTH
};
