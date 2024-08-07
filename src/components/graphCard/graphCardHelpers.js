import moment from 'moment';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers, helpers } from '../../common';

/**
 * Update chart/graph filters with base settings with styling.
 *
 * @param {Array} filters
 * @returns {{standaloneFilters: Array, groupedFilters: Array}}
 */
const generateChartSettings = (filters = []) => {
  const standaloneFilters = [];
  const groupedFilters = [];

  filters.forEach(({ id, isStandalone = false, isThreshold = false, ...settings }) => {
    if (!id) {
      return;
    }

    const baseFilterSettings = {
      id,
      isStacked: !isThreshold,
      isStandalone,
      isThreshold,
      strokeWidth: 2
    };

    if (isThreshold) {
      baseFilterSettings.stroke = chartColorGreenDark.value;
      baseFilterSettings.strokeDasharray = '4,3';
      baseFilterSettings.strokeWidth = 3;
    }

    if (isStandalone) {
      standaloneFilters.push({
        ...baseFilterSettings,
        ...settings
      });
    } else {
      groupedFilters.push({
        ...baseFilterSettings,
        ...settings
      });
    }
  });

  return {
    standaloneFilters,
    groupedFilters
  };
};

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {number}
 */
const getChartXAxisLabelIncrement = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      return 5;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.MONTHLY:
      return 2;
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 1;
  }
};

/**
 * Return a formatted date string.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity } = {}) => {
  const momentDate = moment.utc(date);

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      return `${momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)} - ${momentDate
        .add(1, 'quarter')
        .format(dateHelpers.timestampQuarterFormats.yearShort)}`;

    case GRANULARITY_TYPES.MONTHLY:
      return momentDate.format(dateHelpers.timestampMonthFormats.yearLong);

    case GRANULARITY_TYPES.WEEKLY:
      return `${momentDate.format(dateHelpers.timestampDayFormats.short)} - ${momentDate
        .add(1, 'week')
        .format(dateHelpers.timestampDayFormats.yearShort)}`;

    case GRANULARITY_TYPES.DAILY:
    default:
      return momentDate.format(dateHelpers.timestampDayFormats.long);
  }
};

/**
 * Format x axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} params.tick
 * @param {Date} params.previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ callback, date, granularity, tick, previousDate } = {}) => {
  if (!date || !granularity) {
    return undefined;
  }

  if (callback) {
    return callback({ callback, date, granularity, tick, previousDate });
  }

  const momentDate = moment.utc(date);
  const isNewYear =
    tick !== 0 && Number.parseInt(momentDate.year(), 10) !== Number.parseInt(moment.utc(previousDate).year(), 10);
  let formattedDate;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)
        : momentDate.format(dateHelpers.timestampQuarterFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearShort)
        : momentDate.format(dateHelpers.timestampMonthFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.DAILY:
    default:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);

      formattedDate = formattedDate.replace(/\s(\d{4})$/, '\n$1');
      break;
  }

  return formattedDate;
};

/**
 * Format y axis ticks.
 *
 * @param {object} params
 * @param {Function} params.callback
 * @param {number|string} params.tick
 * @returns {string}
 */
const yAxisTickFormat = ({ callback, tick } = {}) => {
  if (callback) {
    return callback({ tick });
  }

  return helpers
    .numberDisplay(tick)
    ?.format({
      average: true,
      mantissa: 1,
      trimMantissa: true,
      lowPrecision: false
    })
    ?.toUpperCase();
};

/**
 * Generate base chart component props.
 *
 * @param {object} params
 * @param {object} params.settings
 * @param {string} params.granularity
 * @returns {object}
 */
const generateExtendedChartSettings = ({ settings, granularity } = {}) => ({
  ...settings,
  xAxisLabelIncrement: getChartXAxisLabelIncrement(granularity),
  xAxisTickFormat: ({ item, previousItem, tick }) =>
    xAxisTickFormat({
      callback: settings?.xAxisTickFormat,
      tick,
      date: item.date,
      previousDate: previousItem.date,
      granularity
    }),
  yAxisTickFormat: ({ tick }) =>
    yAxisTickFormat({
      callback: settings?.yAxisTickFormat,
      tick
    })
});

const graphCardHelpers = {
  generateChartSettings,
  generateExtendedChartSettings,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  graphCardHelpers as default,
  graphCardHelpers,
  generateChartSettings,
  generateExtendedChartSettings,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};
