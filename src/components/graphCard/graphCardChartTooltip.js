import React from 'react';
import PropTypes from 'prop-types';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { getTooltipDate } from './graphCardHelpers';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';

/**
 * A custom chart tooltip.
 *
 * @param {object} props
 * @param {object} props.datum
 * @param {Function} props.t
 * @param {Function} props.useProduct
 * @returns {Node}
 */
const GraphCardChartTooltip = ({
  datum,
  t,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productLabel } = useAliasProduct();
  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();

  let header = null;
  const data = [];
  const { itemsByKey = {} } = datum || {};

  Object.keys(itemsByKey)
    .reverse()
    .forEach((key, index) => {
      if (index === 0) {
        header = getTooltipDate({
          date: itemsByKey[key]?.data.date,
          granularity
        });
      }

      const tempDataFacet = {
        color: itemsByKey[key]?.color
      };

      if (itemsByKey[key]?.chartType === 'threshold') {
        let thresholdStringValue = itemsByKey[key]?.data.y ?? t('curiosity-graph.label_noData');

        if (itemsByKey[key]?.data.hasInfinite) {
          if (tempDataFacet.color) {
            thresholdStringValue = (
              <ChartIcon
                symbol="infinity"
                fill="#ffffff"
                title={t('curiosity-graph.label_threshold', { context: 'infinite' })}
              />
            );
          } else {
            thresholdStringValue = t('curiosity-graph.label_threshold', { context: 'infinite' });
          }
        }

        tempDataFacet.label = t('curiosity-graph.label_threshold');
        tempDataFacet.value = thresholdStringValue;
      } else {
        const dataFactsValue =
          (itemsByKey[key]?.data.hasData === false && t('curiosity-graph.label_noData')) ||
          itemsByKey[key]?.data.y ||
          0;

        tempDataFacet.label = t('curiosity-graph.label', { context: key, product: productLabel });
        tempDataFacet.value = dataFactsValue;
      }

      tempDataFacet.chartType = itemsByKey[key]?.chartType;
      data.push(tempDataFacet);
    });

  return (
    <div className="curiosity-usage-graph__tooltip">
      <table summary={t('curiosity-graph.tooltipSummary')}>
        {(data.length && header && (
          <thead>
            <tr>
              <th colSpan={2}>{header}</th>
            </tr>
          </thead>
        )) ||
          null}
        {(data.length && (
          <tbody>
            {data.map(dataFacet => {
              const updatedDataFacetValue =
                (typeof dataFacet.value === 'number' &&
                  !Number.isInteger(dataFacet.value) &&
                  helpers
                    .numberDisplay(dataFacet.value)
                    ?.format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: true })
                    ?.toUpperCase()) ||
                dataFacet.value;

              return (
                <tr key={`tooltip-${dataFacet.label}`}>
                  <th>
                    {dataFacet.chartType === 'threshold' && (
                      <ChartIcon size="sm" symbol="dash" fill={dataFacet.color || 'transparent'} />
                    )}
                    {dataFacet.chartType !== 'threshold' && (
                      <ChartIcon size="sm" fill={dataFacet.color || 'transparent'} />
                    )}{' '}
                    {dataFacet.label}
                  </th>
                  <td>{updatedDataFacetValue}</td>
                </tr>
              );
            })}
          </tbody>
        )) ||
          null}
      </table>
      {(!data.length && t('curiosity-graph.label_noData', { context: 'error' })) || null}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{datum: object, useProduct: Function, useProductGraphTallyQuery: Function, t: Function}}
 */
GraphCardChartTooltip.propTypes = {
  datum: PropTypes.shape({
    itemsByKey: PropTypes.objectOf(
      PropTypes.shape({
        chartType: PropTypes.string,
        color: PropTypes.string,
        data: PropTypes.shape({
          date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
          hasData: PropTypes.bool,
          hasInfinite: PropTypes.bool,
          y: PropTypes.number
        })
      })
    )
  }),
  t: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: object, useProduct: Function, useProductGraphTallyQuery: Function, t: Function}}
 */
GraphCardChartTooltip.defaultProps = {
  datum: {},
  t: translate,
  useProduct,
  useProductGraphTallyQuery
};

export { GraphCardChartTooltip as default, GraphCardChartTooltip };
