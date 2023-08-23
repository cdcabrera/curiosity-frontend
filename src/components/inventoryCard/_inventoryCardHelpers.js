import React from 'react';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SET_TYPES, RHSM_API_RESPONSE_META_TYPES } from '../../services/rhsm/rhsmConstants';
import { InventoryGuests } from '../inventoryGuests/inventoryGuests';
import { tableHelpers } from '../table/_table';

/**
 * @memberof InventoryCard
 * @module InventoryCardHelpers
 */

/**
 * Normalize inventory filters, settings into a consistent format.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object} params.settings
 * @param {string} params.productId
 * @returns {{settings: {}, columnCountAndWidths: {count: number, widths: []}, filters: []}}
 */
const normalizeInventorySettings = ({ filters = [], settings = {}, productId } = {}) => {
  const updatedFilters = [];
  const columnCountAndWidths = { count: filters.length, widths: [] };

  filters.forEach(({ metric, header, cell, width, ...rest }) => {
    let updatedHeader;
    let updatedCell;
    let updatedWidth;

    if (typeof header === 'function' && header) {
      updatedHeader = header;
    } else if (header) {
      updatedHeader = () => header;
    } else {
      updatedHeader = () => translate('curiosity-inventory.header', { context: [metric, productId] });
    }

    if (typeof cell === 'function' && cell) {
      updatedCell = cell;
    } else if (cell) {
      updatedCell = () => cell;
    } else {
      updatedCell = ({ [metric]: displayValue }) => displayValue;
    }

    if (typeof width === 'number' && !Number.isNaN(width)) {
      updatedWidth = width;
    }

    columnCountAndWidths.widths.push(updatedWidth);

    updatedFilters.push({
      label: translate('curiosity-inventory.header', { context: [metric, productId] }),
      metric,
      width,
      ...rest,
      header: updatedHeader,
      cell: updatedCell
    });
  });

  return {
    columnCountAndWidths,
    filters: updatedFilters,
    settings
  };
};

// ToDo: evaluate moving isWrap under the table component
// ToDo: evaluate a fallback "perPageDefault = 10" defined here
/**
 * Parse an inventory API response against available filters, query parameters, and session values.
 *
 * @param {object} params
 * @param {object} params.data
 * @param {Array} params.filters
 * @param {object} params.query
 * @param {object} params.session
 * @param {object} params.settings
 * @returns {{dataSetColumnHeaders: [], resultsPerPage: number, resultsOffset: number, dataSetRows: [], resultsCount: number}}
 */
const parseInventoryResponse = ({ data = {}, filters = [], query = {}, session = {}, settings = {} } = {}) => {
  const { data: listData = [], meta = {} } = data;
  const resultsCount = meta[RHSM_API_RESPONSE_META_TYPES.COUNT];
  const {
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: resultsOffset,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: resultsPerPage,
    [RHSM_API_QUERY_SET_TYPES.SORT]: sortColumn,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: sortDirection
  } = query;

  const dataSetColumnHeaders = [];
  const dataSetRows = [];
  const columnData = {};

  listData.forEach(rowData => {
    const dataSetRow = [];
    let expandedContent;

    filters.forEach(({ metric, label, cell, ...rest }) => {
      const updatedCell = cell({ ...rowData }, { ...session }, { ...meta });
      dataSetRow.push({ metric, ...rest, dataLabel: label, content: updatedCell });

      columnData[metric] ??= [];
      columnData[metric].push(updatedCell);
    });

    if (typeof settings?.guestContent === 'function') {
      const guestContentResults = settings.guestContent({ ...rowData }, { ...session }, { ...meta });
      const { id: guestId, numberOfGuests } = guestContentResults || {};

      if (guestId && numberOfGuests) {
        expandedContent = () => (
          <InventoryGuests key={`guests-${guestId}`} id={guestId} numberOfGuests={numberOfGuests} />
        );
      }
    }

    dataSetRows.push({ cells: dataSetRow, row: rowData, expandedContent });
  });

  filters.forEach(({ metric, header, ...rest }) => {
    const updatedHeader = header({ ...columnData[metric] }, { ...session }, { ...meta });
    const updatedRest = { ...rest };

    if (updatedRest.isSort === true && sortDirection && sortColumn === metric) {
      updatedRest.isSortActive = true;
      updatedRest.sortDirection = sortDirection;
    }

    if (updatedRest.isWrap === true) {
      updatedRest.modifier = tableHelpers.WrapModifierVariant.wrap;
    }

    dataSetColumnHeaders.push({ metric, ...updatedRest, content: updatedHeader });
  });

  return {
    dataSetColumnHeaders,
    dataSetRows,
    resultsCount,
    resultsOffset,
    resultsPerPage
  };
};

const inventoryCardHelpers = {
  normalizeInventorySettings,
  parseInventoryResponse
};

export { inventoryCardHelpers as default, inventoryCardHelpers, normalizeInventorySettings, parseInventoryResponse };