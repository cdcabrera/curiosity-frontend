import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * @memberof Types
 * @module QueryTypes
 */

const SET_QUERY = 'SET_QUERY';
const SET_QUERY_CLEAR = 'SET_QUERY_CLEAR';
const SET_QUERY_CLEAR_INVENTORY_LIST = 'SET_QUERY_CLEAR_INVENTORY_LIST';
const SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST = 'SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST';
const SET_QUERY_RESET_INVENTORY_LIST = 'SET_QUERY_RESET_INVENTORY_LIST';

/**
 * Query types associated with across ALL queries.
 */
const SET_QUERY_RHSM_TYPES = {
  [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.BILLING_PROVIDER}`,
  [RHSM_API_QUERY_TYPES.END_DATE]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.END_DATE}`,
  [RHSM_API_QUERY_TYPES.GRANULARITY]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.GRANULARITY}`,
  [RHSM_API_QUERY_TYPES.SLA]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.SLA}`,
  [RHSM_API_QUERY_TYPES.START_DATE]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.START_DATE}`,
  [RHSM_API_QUERY_TYPES.UOM]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.UOM}`,
  [RHSM_API_QUERY_TYPES.USAGE]: `SET_QUERY_RHSM_${RHSM_API_QUERY_TYPES.USAGE}`
};

/**
 * Inventory query types associated with only GUESTS' queries.
 */
const SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES = {
  [RHSM_API_QUERY_TYPES.LIMIT]: `SET_QUERY_RHSM_GUESTS_INVENTORY_${RHSM_API_QUERY_TYPES.LIMIT}`,
  [RHSM_API_QUERY_TYPES.OFFSET]: `SET_QUERY_RHSM_GUESTS_INVENTORY_${RHSM_API_QUERY_TYPES.OFFSET}`
};

/**
 * Inventory query types associated with only HOSTS' and INSTANCES' queries.
 */
const SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES = {
  [RHSM_API_QUERY_TYPES.DIRECTION]: `SET_QUERY_RHSM_HOSTS_INVENTORY_${RHSM_API_QUERY_TYPES.DIRECTION}`,
  [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: `SET_QUERY_RHSM_HOSTS_INVENTORY_${RHSM_API_QUERY_TYPES.DISPLAY_NAME}`,
  [RHSM_API_QUERY_TYPES.SORT]: `SET_QUERY_RHSM_HOSTS_INVENTORY_${RHSM_API_QUERY_TYPES.SORT}`,
  [RHSM_API_QUERY_TYPES.LIMIT]: `SET_QUERY_RHSM_HOSTS_INVENTORY_${RHSM_API_QUERY_TYPES.LIMIT}`,
  [RHSM_API_QUERY_TYPES.OFFSET]: `SET_QUERY_RHSM_HOSTS_INVENTORY_${RHSM_API_QUERY_TYPES.OFFSET}`
};

/**
 * Inventory query types associated with only SUBSCRIPTIONS' queries.
 */
const SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES = {
  [RHSM_API_QUERY_TYPES.DIRECTION]: `SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_${RHSM_API_QUERY_TYPES.DIRECTION}`,
  [RHSM_API_QUERY_TYPES.SORT]: `SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_${RHSM_API_QUERY_TYPES.SORT}`,
  [RHSM_API_QUERY_TYPES.LIMIT]: `SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_${RHSM_API_QUERY_TYPES.LIMIT}`,
  [RHSM_API_QUERY_TYPES.OFFSET]: `SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_${RHSM_API_QUERY_TYPES.OFFSET}`
};

/**
 * Query/filter reducer types.
 *
 * @type {{SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES: object, SET_QUERY_RHSM_TYPES: object,
 *     SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES: object, SET_QUERY_CLEAR: string, SET_QUERY_CLEAR_INVENTORY_LIST: string,
 *     SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES: object, SET_QUERY: string, SET_QUERY_RESET_INVENTORY_LIST: string,
 *     SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST: string}}
 */
const queryTypes = {
  SET_QUERY,
  SET_QUERY_CLEAR,
  SET_QUERY_CLEAR_INVENTORY_LIST,
  SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST,
  SET_QUERY_RESET_INVENTORY_LIST,
  SET_QUERY_RHSM_TYPES,
  SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES,
  SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES,
  SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES
};

export {
  queryTypes as default,
  queryTypes,
  SET_QUERY,
  SET_QUERY_CLEAR,
  SET_QUERY_CLEAR_INVENTORY_LIST,
  SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST,
  SET_QUERY_RESET_INVENTORY_LIST,
  SET_QUERY_RHSM_TYPES,
  SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES,
  SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES,
  SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES
};
