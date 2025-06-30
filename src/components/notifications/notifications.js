import React from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { NotificationsProvider } from '@redhat-cloud-services/frontend-components-notifications';
import { context as NotificationsContext } from './notificationsContext';
import { helpers } from '../../common';

/**
 * Notification functionality
 *
 * @memberof Components
 * @module Notifications
 * @property {module} NotificationsContext
 */

/**
 * Toast notification, or Alert, variants.
 *
 * @type {{success: AlertVariant.success, danger: AlertVariant.danger, warning: AlertVariant.warning,
 *     info: AlertVariant.info, custom: AlertVariant.custom}}
 */
const NotificationVariant = { ...AlertVariant };

/**
 * Expose consoledot toast notifications.
 *
 * @param {object} props - The prop object for the component.
 * @param {React.ReactNode} props.children - The child components or elements to be rendered.
 * @returns {React.ReactNode} The rendered output, either wrapped with NotificationsProvider or plain children.
 */
const Notifications = ({ children }) => {
  if (!helpers.UI_DISABLED_NOTIFICATIONS) {
    return <NotificationsProvider>{children}</NotificationsProvider>;
  }

  return children;
};

export { Notifications as default, Notifications, NotificationsContext, NotificationVariant };
