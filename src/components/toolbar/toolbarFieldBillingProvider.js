import React, { useCallback, useEffect, useMemo } from 'react';
import { useMount, useShallowCompareEffect } from 'react-use';
import { FilterIcon } from '@patternfly/react-icons';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import {
  useProduct,
  useProductBillingAccountsQuery,
  useProductConfig,
  useProductQuery
} from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import {
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES as FIELD_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';

/**
 * A standalone Billing Provider select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldBillingProvider
 */

/**
 * Select field callback for options. Parallel to leveraging "useMemo" but retains the memoize cache since it's outside
 * of React.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const getToolbarFieldOptions = (providers = []) =>
  providers.map(type => ({
    title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type] }),
    value: type,
    isSelected: false
  }));

/**
 * A memoized response for the getToolbarFieldOptions function. Assigned to a property for testing function.
 * Helps retain the memoize cache since it's outside the React hook.
 *
 * @type {Function}
 */
getToolbarFieldOptions.memo = helpers.memo(getToolbarFieldOptions, { cacheLimit: 10 });

/*
 *const setup = helpers.memo(
 *  providers => {
 *    // return (fulfilled === true && billing?.billingProviders) || []
 *    console.log('>>>>>> THIS SHOULD NOT BE FIRING MULTIPLE TIMES', providers);
 *    dispatch([
 *      {
 *        type: reduxTypes.query.SET_QUERY,
 *        viewId,
 *        filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
 *        value: providers[0]
 *      }
 *    ]);
 *
 *    return providers.map(type => ({
 *      title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type] }),
 *      value: type,
 *      isSelected: false
 *    }));
 *  },
 *  { cacheLimit: 25 }
 *);
 *
 *if (fulfilled === true && billing?.billingProviders?.length) {
 *  return setup(billing.billingProviders);
 *}
 *
 *return [];
 */
/*
 *return useMemo(() => {
 *  // return (fulfilled === true && billing?.billingProviders) || []
 *  if (fulfilled === true && billing.billingProviders?.length) {
 *    console.log('>>>>>> THIS SHOULD NOT BE FIRING MULTIPLE TIMES');
 *    dispatch([
 *      {
 *        type: reduxTypes.query.SET_QUERY,
 *        viewId,
 *        filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
 *        value: billing.billingProviders[0]
 *      }
 *    ]);
 *
 *    return billing.billingProviders.map(type => ({
 *      title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type]
 *      }), value: type,
 *      isSelected: false
 *      // isSelected: index === 0
 *    }));
 *  }
 *
 *  return [];
 *}, [billing.billingProviders, dispatch, fulfilled, viewId]);
 */
// };

/**
 * On select update billing provider.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return useCallback(
    ({ value = null } = {}) => {
      console.log('>>>> ON SELECT', value);

      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
          viewId: productId
        },
        {
          type: reduxTypes.query.SET_QUERY,
          viewId: productId,
          filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
          value
        }
      ]);
    },
    [dispatch, productId]
  );
};

/**
 * Select field hook for options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  getToolbarFieldOptions: getAliasToolbarFieldOptions = getToolbarFieldOptions.memo,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProduct: useAliasProduct = useProduct,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const onSelect = useAliasOnSelect();
  const query = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const { data = {} } = useAliasSelectorsResponse([
    { id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] }
  ]);
  const updatedOptions = getAliasToolbarFieldOptions(data?.billing?.billingProviders);
  const [firstUpdatedOption = {}] = updatedOptions;

  useShallowCompareEffect(() => {
    getBillingAccounts(productId, query)(dispatch);
  }, [productId, query]);

  useEffect(() => {
    if (firstUpdatedOption.value) {
      onSelect({ value: firstUpdatedOption.value });
      /*
      dispatch([
        {
          type: reduxTypes.query.SET_QUERY,
          viewId,
          filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
          value: firstUpdatedOption.value
        }
      ]);
      */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstUpdatedOption.value]);

  return updatedOptions;
};

/**
 * Display a billing provider field with options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductQuery} [props.useProductQuery=useProductQuery]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldBillingProvider = ({
  isFilter = false,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();

  console.log('>>>>', options);

  const updatedOptions = options?.map(option => ({
    ...option,
    // isSelected: (updatedValue && option.value === updatedValue) || option?.isSelected
    isSelected: option.value === updatedValue
  }));

  /*
   * const onLoadOptions = ({ selectedOption }) => {
   *  console.log('>>>>>>>> ONLOAD', selectedOption);
   *  onSelect(selectedOption);
   * };
   */

  return (
    <Select
      // onLoadOptions={onLoadOptions}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      toggle={{ icon: <FilterIcon /> }}
      data-test="toolbarFieldBillingProvider"
    />
  );
};

export { ToolbarFieldBillingProvider as default, ToolbarFieldBillingProvider, useOnSelect, useToolbarFieldOptions };
