import React, { useMemo } from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * A standalone Granularity select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldGranularity
 */

/**
 * Generate select field options.
 *
 * @param {object} params
 * @param {Array<string>} [params.options=Object.values(FIELD_TYPES)]
 * @param {translate} [params.t=translate]
 * @param {useProductGraphTallyQuery} [params.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @returns {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  options = Object.values(FIELD_TYPES),
  t = translate,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();

  return useMemo(
    () =>
      options.map(type => ({
        title: t('curiosity-toolbar.label', { context: ['granularity', type] }),
        value: type,
        isSelected: type === granularity
      })),
    [granularity, options, t]
  );
};

/**
 * On select update granularity.
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
    const { startDate, endDate } = dateHelpers.getRangedDateTime(value);
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId: productId
      },
      {
        type: reduxTypes.query.SET_QUERY_GRAPH,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
        value
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.START_DATE,
        value: startDate.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.END_DATE,
        value: endDate.toISOString()
      }
    ]);
  };
};

/**
 * Display a granularity field with options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductGraphTallyQuery} [props.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldGranularity = ({
  isFilter = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: updatedValue } = useAliasProductGraphTallyQuery();
  const options = useAliasToolbarFieldOptions();
  const onSelect = useAliasOnSelect();

  console.log('>>>> GRANULARITY', updatedValue);

  return (
    <Select
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'granularity' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'granularity' })}
      alignment={{ position }}
      data-test="toolbarFieldGranularity"
    />
  );
};

export { ToolbarFieldGranularity as default, ToolbarFieldGranularity, useOnSelect, useToolbarFieldOptions };
