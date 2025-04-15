import React, { useCallback, useMemo, useContext, useEffect, useState } from 'react';
import { useShallowCompareEffect, useMount, useEffectOnce } from 'react-use';
import { useSession } from '../authentication/authenticationContext';
import { reduxHelpers } from '../../redux/common';
import { storeHooks } from '../../redux/hooks';
import { RHSM_API_QUERY_SET_TYPES, rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { platformConstants } from '../../services/platform/platformConstants';
import { helpers } from '../../common/helpers';
import { reduxActions } from '../../redux';

/**
 * @memberof ProductView
 * @module ProductViewContext
 */

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const ProductViewContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Return a query object from initial product config and Redux store.
 *
 * @param {string} queryType An identifier used to pull from both config and Redux, they should named the same.
 * @param {object} options
 * @param {string} options.overrideId A custom identifier, used for scenarios like the Guest inventory IDs
 * @param {object} options.useProductViewContext
 * @param {Function} options.useSelectors
 * @returns {object}
 */
const useProductQueryFactory = (
  queryType,
  {
    overrideId,
    // useProductViewContext: useAliasProductViewContext = useProductViewContext,
    useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
  } = {}
) => {
  const { [queryType]: initialQuery, productId, viewId } = useContext(ProductViewContext);
  const [queryOverride, queryProduct, queryView] = useAliasSelectors([
    ({ view }) => view?.[queryType]?.[overrideId],
    ({ view }) => view?.[queryType]?.[productId],
    ({ view }) => view?.[queryType]?.[viewId]
  ]);

  return {
    ...initialQuery,
    ...queryOverride,
    ...queryProduct,
    ...queryView
  };
};

/**
 * Return the billing account id base query, sans-productId.
 * Note: The billing accounts query is a one-off when compared to other API calls.
 * We align the productId use with ALL API calls by passing it separately.
 *
 * @param {object} options
 * @param {string} [options.queryType='billingAccountsQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
 * @param {useSession} [options.useSession=useSession]
 * @param {object} [options.options]
 * @returns {object}
 */
const useProductBillingAccountsQuery = ({
  queryType = 'billingAccountsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  useSession: useAliasSession = useSession,
  options
} = {}) => {
  const { orgId } = useAliasSession();
  return reduxHelpers.setApiQuery(
    {
      ...useAliasProductQueryFactory(queryType, options),
      [rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES.ORG_ID]: orgId
    },
    schemaCheck
  );
};

const useProductConditionalOnload = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  // useProductContext: useAliasProductContext = useProductContext,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery
  // useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const query = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const { onloadProduct, productId } = useContext(ProductViewContext);
  /*
   * const isBillingAccountRequired = onloadProduct?.find(value => value ===
   * RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined; const selectors = [];
   * if (isBillingAccountRequired) { selectors.push({ id: 'billing', selector:
   * ({ app }) => app.billingAccounts?.[productId] }); } const response = useAliasSelectorsResponse(selectors);
   */

  useMount(() => {
    /*
     *console.log(
     *  '>>>> BILLInG ACCOUNT FIRED CHECK 001',
     *  isBillingAccountRequired,
     *  onloadProduct,
     *  onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined
     *);
     */
    // console.log('>>>>>>>>>>> BILLING ACCOUNT FIRED CHECK 002', RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID);

    if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
      console.log('>>>> BILLInG ACCOUNT FIRED CHECK 003');
      // await dispatch(getBillingAccounts(productId, query));
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isBillingAccountRequired, productId]);

  /*
   * return {
   *  isReady: !onloadProduct || !onloadProduct.length || response?.fulfilled || false,
   *  ...response
   * };
   */
};

const realFngMemo = context => context;
realFngMemo.memo = helpers.memo(realFngMemo, { cacheLimit: 25 });

/**
 * Get an UNFILTERED product view context.
 *
 * @returns {React.Context<{}>}
 */
const useProductViewContext = () => {
  const context = useContext(ProductViewContext);
  return realFngMemo.memo(context);
};

/*
 *const useProductViewContext = () => {
 *  const context = useContext(ProductViewContext);
 *  // const query = useAliasProductBillingAccountsQuery();
 *  // const dispatch = useAliasDispatch();
 *  // const { onloadProduct, productId } = context;
 *
 *  useMount(() => {
 *    // useProductConditionalOnload();
 *    console.log('>>>>>> WTF');
 *  });
 *
 *  return context;
 *};
 */

const doFunc = callback => callback();
doFunc.memo = helpers.memo(doFunc, { cacheLimit: 25 });

const doit = ({ onloadProduct, productId } = {}) => {
  if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
    console.log('>>>>>> WTF');
  }
};

doit.memo = helpers.memo(doit, { cacheLimit: 25 });

/**
 * Get a FILTERED product context.
 *
 * @param {object} options
 * @param {Function} options.useProductViewContext
 * @param options.getBillingAccounts
 * @param options.useDispatch
 * @param options.useProductBillingAccountsQuery
 * @returns {object}
 */
const useProductContext = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useProductViewContext: useAliasProductViewContext = useProductViewContext
} = {}) => {
  const [product, setProduct] = useState();
  const context = useAliasProductViewContext();
  const dispatch = useAliasDispatch();
  const query = useAliasProductBillingAccountsQuery();

  const { onloadProduct, productId } = context;
  // doit.memo({ onloadProduct, productId, dispatch });
  const dispatchApi = [];

  if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
    dispatchApi.push(getBillingAccounts(productId, query));
  }

  useEffect(() => {
    setProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (product && dispatchApi.length) {
      console.log('>>>>> DISPATCH', dispatchApi);
      dispatch(dispatchApi);
    }
  }, [product]);

  /*
  const callback = useCallback(() => {
    console.log('>>>> DO FUNC 001');

    if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
      console.log('>>>> DO FUNC 002');
      dispatch(getBillingAccounts(productId, query));
    }
  }, [productId]);

  callback();
  */

  /*
  doFunc.memo(
    async () => {
      console.log('>>>> DO FUNC 001');

      if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
        console.log('>>>> DO FUNC 002');
        dispatch(getBillingAccounts(productId, query));
      }
    },
    onloadProduct,
    productId
  );
  */
  /*
   *const test = useMemo(() => {
   *  console.log('>>>> PROD ID', productId);
   *  return productId;
   *}, [productId]);
   */

  /*
   *const callback = useMemo(() => {
   *  if (onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined) {
   *    console.log('>>>>>> WTF');
   *  }
   *  return context;
   *}, [productId]);
   */

  return context;
};

/**
 * Return a base product query
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductQuery = ({
  queryType = 'query',
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) => useAliasProductQueryFactory(queryType, options);

const useProductConditionalQuery = ({
  useProductViewContext: useAliasProductViewContext = useProductViewContext,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  // const [query, setQuery] = useState({});
  const { onloadProduct, productId } = useAliasProductViewContext(); // useContext(ProductViewContext);
  const isBillingAccountRequired =
    onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;
  const selectors = [];

  if (isBillingAccountRequired) {
    selectors.push({ id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] });
  }

  const { fulfilled, data = {} } = useAliasSelectorsResponse(selectors);

  /*
  useEffect(() => {
    if (fulfilled === true) {
      const updatedQuery = {};

      if (isBillingAccountRequired) {
        updatedQuery[RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID] = data?.billing?.defaultAccount || undefined;
      }

      setQuery(updatedQuery);
      console.log('>>>> CONDITIONAL QUERY', updatedQuery);
    }
  }, [fulfilled, productId]);
  */

  console.log('>>>>>> CONDITIONAL PRODUCT ID', productId);
  console.log('>>>>>> CONDITIONAL FULFILLED', fulfilled);

  useMount(() => {
    console.log('>>>>> CONDITIONAL MOUNT');
  });

  useMount(() => {
    console.log('>>>>> CONDITIONAL unmount');
  });

  return useMemo(() => {
    console.log('>>>> CONDITIONAL QUERY 001', productId);
    // if (fulfilled === true) {
    //  const updatedQuery = {};

      // if (isBillingAccountRequired) {
      // updatedQuery[RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID] = data?.billing?.defaultAccount || undefined;
      // }

    //  console.log('>>>> CONDITIONAL QUERY 002', updatedQuery);
    //  return updatedQuery;
    // }
    return {};
  }, [productId]);
};

/**
 * Return the graph query based off of tally and capacity.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {useProductConditionalQuery} options.useProductConditionalQuery
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductGraphTallyQuery = ({
  queryType = 'graphTallyQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  useProductConditionalQuery: useAliasProductConditionalQuery = useProductConditionalQuery,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductConditionalQuery(),
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return the inventory query for guests. Use fallback/defaults for guests offset, limit.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventoryGuestsQuery = ({
  queryType = 'inventoryGuestsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return an inventory query for hosts.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {useProductConditionalQuery} options.useProductConditionalQuery
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventoryHostsQuery = ({
  queryType = 'inventoryHostsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductConditionalQuery: useAliasProductConditionalQuery = useProductConditionalQuery,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductConditionalQuery(),
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return an inventory query for subscriptions.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {useProductConditionalQuery} options.useProductConditionalQuery
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventorySubscriptionsQuery = ({
  queryType = 'inventorySubscriptionsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductConditionalQuery: useAliasProductConditionalQuery = useProductConditionalQuery,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductConditionalQuery(),
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return a unified query for toolbars
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductGraphTallyQuery
 * @param {Function} options.useProductInventoryHostsQuery
 * @param {Function} options.useProductInventorySubscriptionsQuery
 * @param {object} options.options
 * @returns {object}
 */
const useProductToolbarQuery = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  useProductInventoryHostsQuery: useAliasProductInventoryHostsQuery = useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery:
    useAliasProductInventorySubscriptionsQuery = useProductInventorySubscriptionsQuery,
  options
} = {}) => ({
  ...useAliasProductQuery({ options }),
  ...useAliasProductGraphTallyQuery({ options }),
  ...useAliasProductInventoryHostsQuery({ options }),
  ...useAliasProductInventorySubscriptionsQuery({ options })
});

/**
 * Return product identifiers.
 *
 * @param {object} options
 * @param {Function} options.useProductViewContext
 * @returns {{productLabel, viewId, productId, productGroup, productVariants}}
 */
const useProduct = ({ useProductViewContext: useAliasProductViewContext = useProductViewContext } = {}) => {
  const { productGroup, productId, productLabel, productVariants, viewId } = useAliasProductViewContext();
  return {
    productGroup,
    productId,
    productLabel,
    productVariants,
    viewId
  };
};

/**
 * Return graph configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductGraphConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialGraphFilters, initialGraphSettings = {} } = useAliasProductContext();
  return {
    filters: initialGraphFilters,
    settings: initialGraphSettings
  };
};

/**
 * Return guests inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventoryGuestsConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { inventoryGuestsQuery = {}, initialGuestsFilters, initialGuestsSettings = {} } = useAliasProductContext();
  return {
    filters: initialGuestsFilters,
    initialQuery: inventoryGuestsQuery,
    settings: initialGuestsSettings
  };
};

/**
 * Return inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventoryHostsConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialInventoryFilters, initialInventorySettings = {} } = useAliasProductContext();
  return {
    filters: initialInventoryFilters,
    settings: initialInventorySettings
  };
};

/**
 * Return subscriptions inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventorySubscriptionsConfig = ({
  useProductContext: useAliasProductContext = useProductContext
} = {}) => {
  const { initialSubscriptionsInventoryFilters, initialSubscriptionsInventorySettings = {} } = useAliasProductContext();
  return {
    filters: initialSubscriptionsInventoryFilters,
    settings: initialSubscriptionsInventorySettings
  };
};

/**
 * Return primary toolbar configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductToolbarConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialToolbarFilters, initialToolbarSettings = {} } = useAliasProductContext();
  return {
    filters: initialToolbarFilters,
    settings: initialToolbarSettings
  };
};

/**
 * Return an export query for subscriptions.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductToolbarQuery
 * @param {object} options.options
 * @returns {{}}
 */
const useProductExportQuery = ({
  useProduct: useAliasProduct = useProduct,
  schemaCheck = platformConstants.PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES,
  useProductToolbarQuery: useAliasProductToolbarQuery = useProductToolbarQuery,
  options
} = {}) => {
  const { productId } = useAliasProduct();
  return reduxHelpers.setApiQuery(
    {
      ...useAliasProductToolbarQuery({ options }),
      [platformConstants.PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES.PRODUCT_ID]: productId
    },
    schemaCheck
  );
};

const useProductOnloadOLD = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductContext: useAliasProductContext = useProductContext,
  useProduct: useAliasProduct = useProduct,
  // useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery
  // useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const { onloadProduct } = useAliasProductContext();

  useEffect(() => {
    const isBillingAccountRequired =
      onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;
    console.log('>>>> BILLInG ACCOUNT FIRED CHECK', isBillingAccountRequired);

    if (isBillingAccountRequired === true) {
      console.log('>>>> BILLInG ACCOUNT FIRED CHECK', isBillingAccountRequired);
      dispatch(getBillingAccounts(productId, query));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onloadProduct]);

  /*
   *const { onloadProduct, ...rest } = useAliasProductContext();
   *console.log('>>>>> ONLOAD PRODUCT', onloadProduct, rest);
   *const { productId } = useAliasProduct();
   * // const { filters = [] } = useAliasProductToolbarConfig();
   *const query = useAliasProductBillingAccountsQuery();
   *const dispatch = useAliasDispatch();
   *
   *const isBillingAccountRequired =
   *  onloadProduct?.find(value => value === RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;
   *const selectors = [];
   *
   *if (isBillingAccountRequired) {
   *  selectors.push({ id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] });
   *}
   */

  // const response = useAliasSelectorsResponse(selectors);

  /*
   *const isBillingAccountRequired =
   *  filters.find(({ id }) => id === RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER) !== undefined;
   *
   *useMount(async () => {
   *  console.log('>>>> mount product config api lookup', productId);
   *  if (isBillingAccountRequired) {
   *    console.log('>>>> DOING CALL mount product config api lookup', productId);
   *    await dispatch(getBillingAccounts(productId, query));
   *    console.log('>>>> COMPLETE CALL mount product config api lookup', productId);
   *  }
   *});
   */

  /*
   *useEffect(() => {
   *  console.log('>>>> BILLInG ACCOUNT FIRED CHECK', isBillingAccountRequired);
   *
   *  if (isBillingAccountRequired === true) {
   *    console.log('>>>> BILLInG ACCOUNT FIRED CHECK', isBillingAccountRequired);
   *    dispatch(getBillingAccounts(productId, query));
   *  }
   *  // eslint-disable-next-line react-hooks/exhaustive-deps
   *}, [productId]);
   *
   *console.log('>>>> BILLInG ACCOUNT FIRED', isBillingAccountRequired, response);
   *
   *return {
   *  isReady: !onloadProduct || !onloadProduct.length || response?.fulfilled,
   *  ...response
   *};
   */
};

const context = {
  ProductViewContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery: useProductQuery,
  useQueryFactory: useProductQueryFactory,
  useBillingAccountsQuery: useProductBillingAccountsQuery,
  useGraphTallyQuery: useProductGraphTallyQuery,
  useInventoryGuestsQuery: useProductInventoryGuestsQuery,
  useInventoryHostsQuery: useProductInventoryHostsQuery,
  useInventorySubscriptionsQuery: useProductInventorySubscriptionsQuery,
  useProduct,
  useProductConditionalQuery,
  useProductConditionalOnload,
  useProductExportQuery,
  useGraphConfig: useProductGraphConfig,
  useInventoryGuestsConfig: useProductInventoryGuestsConfig,
  useInventoryHostsConfig: useProductInventoryHostsConfig,
  useInventorySubscriptionsConfig: useProductInventorySubscriptionsConfig,
  useToolbarConfig: useProductToolbarConfig,
  useToolbarQuery: useProductToolbarQuery
};

export {
  context as default,
  context,
  ProductViewContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useProductQuery,
  useProductQueryFactory,
  useProductBillingAccountsQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProduct,
  useProductConditionalQuery,
  useProductConditionalOnload,
  useProductExportQuery,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig,
  useProductToolbarQuery
};
