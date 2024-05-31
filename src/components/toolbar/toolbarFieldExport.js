import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount, useShallowCompareEffect } from 'react-use';
import _snakeCase from 'lodash/snakeCase';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductExportQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import { Tooltip } from '../tooltip/tooltip';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { getCurrentDate } from '../../common/dateHelpers';

/**
 * A standalone export select/dropdown filter and download hooks.
 *
 * @memberof Toolbar
 * @module ToolbarFieldExport
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, selected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['export', type] }),
  value: type,
  selected: false
}));

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelectors
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>,
 *     allCompletedDownloads: Array<{ id: string, productId: string }>, isPending: boolean, isCompleted: boolean}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { productId } = useAliasProduct();
  const [product, global] = useAliasSelectors([
    ({ app }) => app?.exports?.[productId],
    ({ app }) => app?.exports?.global
  ]);

  const pendingProductFormats = [];
  const isProductPending =
    product?.data?.data?.products?.[productId]?.isPending ||
    global?.data?.data?.products?.[productId]?.isPending ||
    false;
  const isProductCompleted =
    product?.data?.data?.products?.[productId]?.isCompleted ||
    global?.data?.data?.products?.[productId]?.isCompleted ||
    false;
  const isGlobalPending = global?.data?.data?.isPending || false;
  const isGlobalCompleted = !global?.data?.data?.isPending && global?.data?.data?.isCompleted;

  if (isProductPending) {
    const convert = arr => (Array.isArray(arr) && arr.map(({ format: productFormat }) => productFormat)) || [];
    pendingProductFormats.push(
      ...Array.from(
        new Set([
          ...convert(product?.data?.data?.products?.[productId]?.pending),
          ...convert(global?.data?.data?.products?.[productId]?.pending)
        ])
      )
    );
  }

  /*
   *const pendingFormats = [];
   *let isPending = false;
   *if (Array.isArray(global?.data?.data?.products?.[productId]?.pending)) {
   *  pendingFormats.push(
   *    ...global.data.data.products[productId].pending.map(({ format: productFormat }) => productFormat)
   *  );
   *
   *  if (pendingFormats.length) {
   *    isPending = true;
   *  }
   *} else if (Array.isArray(product?.data?.data?.products?.[productId]?.pending)) {
   *  pendingFormats.push(
   *    ...product.data.data.products[productId].pending.map(({ format: productFormat }) => productFormat)
   *  );
   *
   *  if (pendingFormats.length) {
   *    isPending = true;
   *  }
   *}
   */

  return {
    isGlobalCompleted,
    isGlobalPending,
    isProductCompleted,
    isProductPending,
    pendingProductFormats
  };
};

const useExportNotifications = ({
  addNotification = reduxActions.platform.addNotification,
  removeNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useExportStatus: useAliasExportStatus = useExportStatus
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const { isGlobalCompleted, isGlobalPending, isProductCompleted, isProductPending } = useAliasExportStatus();

  setTimeout(() => {
    if (isProductPending || isGlobalPending) {
      dispatch(removeNotification('swatch-downloads-pending'));
      dispatch(
        addNotification({
          id: 'swatch-downloads-pending',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'title'],
            count: 1
          }),
          dismissable: true,
          autoDismiss: true
        })
      );
    }

    if (!isProductPending && isProductCompleted) {
      dispatch(removeNotification(`swatch-downloads-product-${productId}`));
      dispatch(
        addNotification({
          id: `swatch-downloads-product-${productId}`,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title', productId]
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description']
          }),
          dismissable: true,
          autoDismiss: true
        })
      );
    }

    if (!isGlobalPending && isGlobalCompleted) {
      dispatch(removeNotification('swatch-downloads-global'));
      dispatch(
        addNotification({
          id: 'swatch-downloads-global',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title'],
            count: 1
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            count: 1
          }),
          dismissable: true,
          autoDismiss: true
        })
      );
    }
  });
};

/**
 * Apply an export hook for post and download, and a global polling status.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.getExportStatus
 * @param {Function} options.useDispatch
 * @returns {{getExport: Function, createExport: Function, checkExports: Function}}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  getExportStatus: getAliasExportStatus = reduxActions.platform.getExistingExports,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();

  /**
   * A polling response validator
   *
   * @type {Function}
   */
  // const validate = useCallback(response => response?.data?.data?.isAnythingPending === false, []);

  /**
   * Get a global export status. Sets polling if any pending indicators are found.
   */
  const checkExports = useCallback(() => getAliasExportStatus()(dispatch), [dispatch, getAliasExportStatus]);

  /**
   * Create an export then download. Automatically sets up polling until the file(s) are ready.
   */
  const createExport = useCallback((id, data) => createAliasExport(id, data)(dispatch), [createAliasExport, dispatch]);

  return {
    checkExports,
    createExport
  };
};

/**
 * On select update export.
 *
 * @param {object} options
 * @param {Function} options.useExport
 * @param {Function} options.useProduct
 * @param {Function} options.useProductExportQuery
 * @returns {Function}
 */
const useOnSelect = ({
  useExport: useAliasExport = useExport,
  useProduct: useAliasProduct = useProduct,
  useProductExportQuery: useAliasProductExportQuery = useProductExportQuery
} = {}) => {
  const { createExport } = useAliasExport();
  const { productId } = useAliasProduct();
  const exportQuery = useAliasProductExportQuery();

  return ({ value = null } = {}) => {
    const sources = [
      {
        application: APP_TYPES.SUBSCRIPTIONS,
        resource: RESOURCE_TYPES.SUBSCRIPTIONS,
        filters: {
          ...exportQuery
        }
      }
    ];

    createExport(productId, { format: value, name: `${EXPORT_PREFIX}-${productId}`, sources });
  };
};

/**
 * Display an export/download field with options. Check and download available exports.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useExport
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExport: useAliasExport,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPending, pendingProductFormats = [] } = useAliasExportStatus();
  const { checkExports } = useAliasExport();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPending &&
        pendingProductFormats?.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected: isProductPending && pendingProductFormats?.includes(option.value),
    isDisabled: isProductPending && pendingProductFormats?.includes(option.value)
  }));

  useMount(() => {
    checkExports();
  });

  return (
    <Select
      title={t('curiosity-toolbar.placeholder', { context: 'export' })}
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      position={position}
      data-test="toolbarFieldExport"
      toggleIcon={<ExportIcon />}
      buttonVariant={SelectButtonVariant.plain}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  position: PropTypes.string,
  t: PropTypes.func,
  useExport: PropTypes.func,
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExport,
  useExportStatus,
  useOnSelect
};

export {
  ToolbarFieldExport as default,
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExportStatus,
  useOnSelect
};
