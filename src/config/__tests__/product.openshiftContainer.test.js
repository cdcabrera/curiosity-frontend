import { config } from '../product.openshiftContainer';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';
import { RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES } from '../../services/rhsm/rhsmConstants';

describe('Product OpenShift Container config', () => {
  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      numberOfGuests: 3,
      cores: 20,
      sockets: 100,
      lastSeen: '2022-01-01T00:00:00.000Z',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      inventoryId: null,
      numberOfGuests: null,
      cores: null,
      sockets: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply subscriptions inventory configuration', () => {
    const { initialSubscriptionsInventoryFilters: initialFilters, inventorySubscriptionsQuery: inventoryQuery } =
      config;

    const inventoryData = {
      [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem',
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: 'hello world',
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: '2022-01-01T00:00:00.000Z',
      [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: 2000,
      [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: true
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: null,
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply guest inventory configuration', () => {
    const { initialGuestsFilters: initialFilters } = config;

    const guestsData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      subscriptionManagerId: 'lorem subscription id',
      lastSeen: '2022-01-01T00:00:00.000Z',
      loremIpsum: 'hello world'
    };

    const filteredGuestsData = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData
    });

    expect(filteredGuestsData).toMatchSnapshot('filtered');

    const filteredGuestsDataAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredGuestsDataAuthorized).toMatchSnapshot('filtered, authorized');
  });
});
