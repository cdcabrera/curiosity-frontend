import _set from 'lodash/set';
import { rbacConfig } from '../../config';
import { axiosServiceCall } from '../common/serviceConfig';
import { platformSchemas } from './platformSchemas';
import { platformTransformers } from './platformTransformers';
import { helpers, downloadHelpers } from '../../common';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES
} from './platformConstants';

/**
 * Emulated service calls for platform globals.
 *
 * @memberof Platform
 * @module PlatformServices
 */

/**
 * Basic user authentication.
 *
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUser = async (options = {}) => {
  const { schema = [platformSchemas.user], transform = [platformTransformers.user] } = options;
  const { insights } = window;
  return axiosServiceCall({
    url: async () => {
      try {
        return (
          (helpers.DEV_MODE &&
            _set(
              {},
              [
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
              ],
              process.env.REACT_APP_DEBUG_ORG_ADMIN === 'true'
            )) ||
          (await insights.chrome.auth.getUser())
        );
      } catch (e) {
        throw new Error(`{ getUser } = insights.chrome.auth, ${e.message}`);
      }
    },
    schema,
    transform
  });
};

/**
 * Basic user permissions.
 *
 * @param {string} appName
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUserPermissions = (appName = Object.keys(rbacConfig), options = {}) => {
  const { schema = [platformSchemas.permissions], transform = [platformTransformers.permissions] } = options;
  const updatedAppName = (Array.isArray(appName) && appName) || [appName];
  const { insights } = window;
  const platformMethod = name =>
    (helpers.DEV_MODE && [
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
      },
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
      }
    ]) ||
    insights.chrome.getUserPermissions(name);

  return axiosServiceCall({
    url: async () => {
      let userPermissions;

      try {
        const allPermissions = await Promise.all(updatedAppName.map(name => platformMethod(name)));

        if (Array.isArray(allPermissions)) {
          userPermissions = [...allPermissions.flat()];
        }
      } catch (e) {
        throw new Error(`{ getUserPermissions } = insights.chrome, ${e.message}`);
      }

      return userPermissions;
    },
    schema,
    transform
  });
};

/**
 * Disables the Platform's global filter display.
 *
 * @param {boolean} isHidden
 * @returns {Promise<*>}
 */
const hideGlobalFilter = async (isHidden = true) => {
  const { insights } = window;
  try {
    await insights.chrome.hideGlobalFilter(isHidden);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * @apiMock {ForceStatus} 202
 * @api {delete} /api/export/v1/exports/:id
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 OK
 *     {}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Delete an export. Useful for clean up. Helps avoid having to deal with export lists and most recent exports.
 *
 * @param {string} id ID of export to delete
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const deleteExport = (id, options = {}) => {
  const { cache = false, cancel = true, cancelId } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    method: 'delete',
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 2000
 * @apiMock {RandomSuccess}
 * @api {get} /api/export/v1/exports
 * @apiDescription Get multiple, or a single, export status
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "complete"
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial"
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "complete"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "complete"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "unknown-export",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not valid",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * @api {get} /api/export/v1/exports/:id/status
 * @apiDescription Get a single export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "swatch-RHEL for x86",
 *       "created_at": "2024-01-24T16:20:31.229Z",
 *       "completed_at": "2024-01-24T16:20:31.229Z",
 *       "expires_at": "2024-01-24T16:20:31.229Z",
 *       "format": "json",
 *       "status": "partial"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not a valid export UUID",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Get multiple export status, or a single status after setup.
 *
 * @param {string|undefined|null} id Export ID
 * @param {object} params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExportStatus = (id, params = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports],
    ...restOptions
  } = options;
  return axiosServiceCall({
    ...restOptions,
    url:
      (id && process.env.REACT_APP_SERVICES_PLATFORM_EXPORT_STATUS.replace('{0}', id)) ||
      process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @api {get} /api/export/v1/exports/:id
 * @apiDescription Get an export by id
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {zip} Success-Response:
 *     HTTP/1.1 200 OK
 *     Success
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not a valid export UUID",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Get an export after setup.
 *
 * @param {string} id Export ID
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {string} options.fileName
 * @param {string} options.fileType
 * @returns {Promise<*>}
 */
const getExport = (id, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId,
    fileName = `swatch_report_${id}`,
    fileType = 'application/gzip'
  } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    responseType: 'blob',
    cache,
    cancel,
    cancelId
  })
    .then(
      success =>
        (helpers.TEST_MODE && success.data) ||
        downloadHelpers.downloadData({
          data: success.data,
          fileName: `${fileName}.tar.gz`,
          fileType
        })
    )
    .then(() => deleteExport(id));
};

const getExports = async () => Promise.reject();

const getExistingExports = (params = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId = 'all-exports',
    poll,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports],
    ...restOptions
  } = options;

  return axiosServiceCall({
    ...restOptions,
    poll: {
      location: {
        url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
        // config: {
        //  cache: false,
        //  cancel: false,
        //  schema: [platformSchemas.exports],
        //  transform: [platformTransformers.exports]
        // },
        ...poll?.location
      },
      // status: (...args) => {
      //  if (typeof poll.status === 'function') {
      //    poll.status.call(null, ...args);
      //  }
      // },//
      validate: response => {
        const isCompleted = !response?.data?.data?.isAnythingPending && response?.data?.data?.isAnythingCompleted;
        const completedResults = response?.data?.data?.completed;

        if (isCompleted && completedResults.length > 0) {
          Promise.all(completedResults.map(({ id }) => getExport(id)));
        }

        return isCompleted;
      },
      ...poll
    },
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/*
 * await Promise.all(idList.map(({ id, options }) => getExport(id, options)));
 * await Promise.all(idList.map(({ id }) => deleteExport(id)));
 * return getExportStatus();
 */
/**
 * Note: 202 status appears to be only response that returns a sources list, OR it's variable depending on
 *     partial/pending status.
 */
/**
 * @apiMock {ForceStatus} 202
 * @api {post} /api/export/v1/exports
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "swatch-RHEL for x86",
 *       "created_at": "2024-01-24T16:20:31.229Z",
 *       "completed_at": "2024-01-24T16:20:31.229Z",
 *       "expires_at": "2024-01-24T16:20:31.229Z",
 *       "format": "json",
 *       "status": "partial",
 *       "sources": [
 *         {
 *           "application": "subscriptions",
 *           "resource": "instances",
 *           "filters": {},
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "status": "pending"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Post to create an export.
 *
 * @param {object} data JSON data to submit
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const postExport = async (data = {}, options = {}) => {
  const {
    cache = false,
    cancel = false,
    cancelId,
    poll,
    schema = [platformSchemas.exports],
    transform = [],
    ...restOptions
  } = options;

  let downloadId;
  const postResponse = await axiosServiceCall({
    ...restOptions,
    poll: {
      location: {
        url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
        config: {
          cache: false,
          cancel: false,
          schema: [platformSchemas.exports],
          transform: [platformTransformers.exports]
        },
        ...poll?.location
      },
      status: (successResponse, ...args) => {
        if (typeof poll.status === 'function') {
          /*
          const foundDownload = response?.data?.data?.completed.find(
            ({ id }) => downloadId !== undefined && id === downloadId
          );

          const updatedSuccessResponse = {
            data: {

            }
          };
          */
          poll.status.call(null, successResponse, ...args);
        }
      },
      validate: response => {
        const foundDownload = response?.data?.data?.completed.find(
          ({ id }) => downloadId !== undefined && id === downloadId
        );

        if (foundDownload) {
          getExport(foundDownload.id);
        }

        return foundDownload !== undefined;
      },
      ...poll
    },
    method: 'post',
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    data,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
  // }).then(response => getExport(response.data.id));
  downloadId = postResponse.data.id;
  return postResponse;
};

const platformServices = {
  deleteExport,
  getExistingExports,
  getExport,
  getExports,
  getExportStatus,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport
};

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ platformServices });

export {
  platformServices as default,
  platformServices,
  deleteExport,
  getExistingExports,
  getExport,
  getExports,
  getExportStatus,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport
};
