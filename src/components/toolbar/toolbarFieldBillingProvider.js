import React, { useMemo } from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A dynamic Billing Provider select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldBillingProvider
 */

/**
 * Generate select field options from config.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  const defaultProvider = data?.defaultProvider;
  const billingProviders = data?.billingProviders;

  console.log('>>> billing provider options', defaultProvider, billingProviders);

  return useMemo(
    () =>
      billingProviders.map(provider => ({
        title: t('curiosity-toolbar.label', { context: ['billing_provider', (provider === '' && 'none') || provider] }),
        value: provider,
        isSelected: provider === defaultProvider
      })),
    [billingProviders, defaultProvider, t]
  );
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
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
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
  };
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
  const updatedOptions = options.map(option => ({ ...option, isSelected: option.value === updatedValue }));

  return (
    <Select
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
