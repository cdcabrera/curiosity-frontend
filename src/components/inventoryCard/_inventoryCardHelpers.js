import React from 'react'; // eslint-disable-line
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SET_TYPES, RHSM_API_RESPONSE_META_TYPES } from '../../services/rhsm/rhsmConstants';
// import { helpers } from '../../common';

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

const parseInventoryResponse = (
  { data = {}, filters = [], query = {}, session = {} } = {}
  // {
  // perPageDefault = 10
  // normalizeInventorySettings: aliasNormalizeInventorySettings = normalizeInventorySettings
  // } = {}
) => {
  const { data: listData = [], meta = {} } = data;
  const resultsCount = meta[RHSM_API_RESPONSE_META_TYPES.COUNT];
  const resultsOffset = query[RHSM_API_QUERY_SET_TYPES.OFFSET];
  const resultsPerPage = query[RHSM_API_QUERY_SET_TYPES.LIMIT];
  const dataSetColumnHeaders = [];
  const dataSetRows = [];
  const columnData = {};

  listData.forEach(rowData => {
    const dataSetRow = [];
    filters.forEach(({ metric, cell, ...rest }) => {
      const updatedCell = cell({ ...rowData }, { ...session }, { ...meta });
      dataSetRow.push({ metric, ...rest, content: updatedCell });

      columnData[metric] ??= [];
      columnData[metric].push(updatedCell);
    });

    dataSetRows.push({ cells: dataSetRow });
  });

  filters.forEach(({ metric, header, ...rest }) => {
    // const updatedHeader = (...args) => header({ ...columnData[metric] }, { ...session }, { ...meta }, ...args);
    const updatedHeader = header({ ...columnData[metric] }, { ...session }, { ...meta });
    dataSetColumnHeaders.push({ ...rest, content: updatedHeader });
  });

  console.log('>>>>> dataSetColumnHeaders', dataSetColumnHeaders);
  console.log('>>>>> dataSetRows', dataSetRows);

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
