import React, { useCallback, useEffect, useMemo } from 'react';
import { useMount } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductBillingAccountsQuery, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import {
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES as FIELD_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone Billing Provider select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldBillingProvider
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
/*
 *const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
 *  title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type] }),
 *  value: type,
 *  isSelected: false
 *}));
 */
const useToolbarFieldOptions = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  // useAuthContext: useAliasAuthContext = useAuthContext,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
  // useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  /*
   * const { orgId } = useAliasAuthContext(); // this can be done through the query hook
   * const [billingProviders, setBillingProviders] = useState([]);
   */
  const { productId } = useAliasProduct();
  const query = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const { fulfilled, data = [] } = useAliasSelectorsResponse(({ app }) => app.billingAccounts?.[productId]);
  /*
   *const { billingProviders } = useAliasSelectors([
   *  ({ auth }) => auth.orgId,
   *  ({ app }) => app.billingAccounts?.[productId]
   *]);
   */

  useMount(() => {
    getBillingAccounts(productId, query)(dispatch);
  });

  const [billing = {}] = data;
  console.log('>>>>', billing.billingProviders);
  return useMemo(() => {
    // return (fulfilled === true && billing?.billingProviders) || []
    if (fulfilled === true && billing.billingProviders) {
      return billing.billingProviders.map(type => ({
        title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type] }),
        value: type,
        isSelected: false
        // isSelected: index === 0
      }));
    }

    return [];
  }, [billing.billingProviders, fulfilled]);
};

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
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return useCallback(
    ({ value = null } = {}) => {
      console.log('>>>> ON SELECT', value);

      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
          viewId
        },
        {
          type: reduxTypes.query.SET_QUERY,
          viewId,
          filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
          value
        }
      ]);
    },
    [dispatch, viewId]
  );
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
  position = SelectPosition.left,
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

  const onLoadOptions = ({ selectedOption }) => {
    console.log('>>>>>>>> ONLOAD', selectedOption);
    onSelect(selectedOption);
  };

  return (
    <Select
      // onLoadOptions={onLoadOptions}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      alignment={{ position }}
      data-test="toolbarFieldBillingProvider"
    />
  );
};

export { ToolbarFieldBillingProvider as default, ToolbarFieldBillingProvider, useOnSelect, useToolbarFieldOptions };
