import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, store } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = dateHelpers.getMonthlyRangedDateTime().listDateTimeRanges.map(dateTime => ({
  ...dateTime,
  selected: false
}));

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {Function} props.t
 * @param {string} props.value
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldRangeGranularity = ({ options, t, value, viewId }) => {
  const updatedValue = value;

  const updatedOptions = options.map(option => ({ ...option, selected: option.title === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = event => {
    console.log('>>> toolbar field', event);
    const { startDate, endDate } = event.value;
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY],
        viewId,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: FIELD_TYPES.DAILY
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate?.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate?.toISOString()
      }
    ]);
  };

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      maxHeight={250}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldRangeGranularity.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  value: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, options: Array, value: string}}
 */
ToolbarFieldRangeGranularity.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: translate('curiosity-toolbar.granularityRange', { context: 'current' }),
  viewId: 'toolbarFieldRangeGranularity'
};

export { ToolbarFieldRangeGranularity as default, ToolbarFieldRangeGranularity, toolbarFieldOptions };
