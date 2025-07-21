import { PLATFORM_API_EXPORT_STATUS_TYPES } from './platformConstants';
import { helpers } from '../../common';

/**
 * @memberof Platform
 * @module PlatformHelpers
 */

/**
 * Normalize a product id pulled from an export name. Fallback filtering for product identifiers.
 *
 * @param {string} str
 * @returns {undefined|string}
 */
const getExportProductId = str => {
  const updatedStr = str;
  const attemptId = updatedStr?.replace(`${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}-`, '')?.trim();

  if (attemptId === updatedStr) {
    return undefined;
  }

  return attemptId;
};

/**
 * Normalize an export status to be either `pending`, `complete`, or `failed`.
 *
 * Fine-grain status messages are considered `pending`. May need to reevaluate
 * the `partial` status.
 *
 * @param {string} str
 * @returns {string}
 */
const getExportStatus = str => {
  const updatedStr = str;
  let updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.PENDING;

  if (
    updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.FAILED ||
    updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE
  ) {
    updatedStatus = updatedStr;
  }

  return updatedStatus;
};

const platformHelpers = {
  getExportProductId,
  getExportStatus
};

export { platformHelpers as default, platformHelpers, getExportProductId, getExportStatus };
