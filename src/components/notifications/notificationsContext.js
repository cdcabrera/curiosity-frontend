import { useContext, useCallback } from 'react';
import { NotificationsContext } from '@redhat-cloud-services/frontend-components-notifications';
import { helpers } from '../../common';

/**
 * @memberof Notifications
 * @module NotificationsContext
 */

/**
 * Use platform notifications. Apply a convenience wrapper for easily removing notifications based on an internal
 * "swatchId"
 *
 * @param {NotificationsContext} [context=NotificationsContext]
 * @returns {{
 *     addNotification: Function,
 *     clearNotifications: Function,
 *     hasNotification: Function,
 *     removeNotification: removeNotification }} Add, clear all, or remove a notification.
 *
 *     - `addNotification` - Add a toast notification. A `swatchId` property is exposed to allow for easy removal.
 *     - `clearNotifications` - Clear all notifications
 *     - `hasNotification` - Check if an ID or `swatchId` notification exists. Returns `undefined` or the notification
 *         object.
 *     - `removeNotifications` - Remove a toast notification based on ID. If you used a plain text `swatchId` to add
 *         the notification, this can be used to remove it. If `DEV_MODE` is enabled, a warning is logged to the
 *         console when an attempt is made to remove a notification using an invalid or non-existent `swatchId` or `id`.
 */
const useNotifications = ({ context = NotificationsContext } = {}) => {
  const {
    addNotification: baseAddNotification,
    removeNotification: baseRemoveNotification,
    getNotifications: baseGetNotifications,
    ...contextMethods
  } = useContext(context);

  /**
   * Add a toast notification.
   *
   * A `swatchId` property is exposed to allow for easy removal.
   *
   * @param {object} notification - Notification object to be added.
   * @param {string} [notification.swatchId] - Optional plain language "unique" identifier that allows for
   *     easy removal.
   * @param {string} [variant] - Optional variant to display, defaults to "info"
   * @param {React.ReactNode} title - Notification title
   * @param {React.ReactNode} [description] - Notification description
   * @returns {void}
   */
  const addNotification = useCallback(
    notification => {
      const { swatchId, swatchid, ...remainingNotification } = notification;
      return baseAddNotification({ ...remainingNotification, swatchid: swatchId || swatchid });
    },
    [baseAddNotification]
  );

  /**
   * Does a notification exist?
   *
   * Check for a matching notification ID or `swatchId` from the collection.
   *
   * @param {string|number} id - Identifier to search for, either the 'swatchid' or 'id'.
   * @returns {object|undefined} Notification object if a match is found or undefined.
   */
  const hasNotification = useCallback(
    id => {
      const notifications = baseGetNotifications();
      return notifications.find(({ swatchid: internalId, id: generatedId }) => internalId === id || generatedId === id);
    },
    [baseGetNotifications]
  );

  /**
   * Remove a toast notification.
   *
   * For convenience IF a `swatchId` property is provided of the notification.
   *
   * @param {id} notification - Unique identifier to remove. This can be the plain language swatchId, or
   *     the generatedId provided by the notification package.
   */
  const removeNotification = useCallback(
    id => {
      const notification = hasNotification(id);

      if (notification) {
        baseRemoveNotification(notification.id);
      } else if (helpers.DEV_MODE) {
        console.warn(
          `Notification with id "${id}" not found. Make sure the notification was created with the "swatchId" prop, or you used the generated id provided by notifications.`
        );
      }
    },
    [hasNotification, baseRemoveNotification]
  );

  return {
    ...contextMethods,
    addNotification,
    hasNotification,
    removeNotification
  };
};

const context = {
  useNotifications
};

export { context as default, context, useNotifications };
