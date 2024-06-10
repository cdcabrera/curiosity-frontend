import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup
} from '@patternfly/react-core';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardActions, useGraphCardContext, useGetMetrics, useChartDataSets } from './graphCardContext';
import { graphCardHelpers } from './graphCardHelpers';
import { Chart } from '../chart/chart';
import { GraphCardChartLegend } from './graphCardChartLegend';
import { GraphCardChartTooltip } from './graphCardChartTooltip';
import { GraphCardChartTitleTooltip } from './graphCardChartTitleTooltip';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { MinHeight } from '../minHeight/minHeight';
import { Loader } from '../loader/loader';
import { translate } from '../i18n/i18n';

/**
 * @memberof GraphCard
 * @module GraphCardChart
 */

/**
 * A chart/graph card.
 *
 * @fires onChartUpdate
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useChartDataSets
 * @param {Function} props.useGetMetrics
 * @param {Function} props.useGraphCardActions
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {React.ReactNode}
 */
const GraphCardChart = ({
  t,
  useChartDataSets: useAliasChartDataSets,
  useGetMetrics: useAliasGetMetrics,
  useGraphCardActions: useAliasGraphCardActions,
  useGraphCardContext: useAliasGraphCardContext,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  // const [, setChartDataSets] = useAliasChartDataSets();
  const updatedActionDisplay = useAliasGraphCardActions();
  const { settings = {}, dataSets: other } = useAliasGraphCardContext();
  const { stringId } = settings;

  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();
  const { pending, error, dataSets = [] } = useAliasGetMetrics();

  const cardHeaderProps = {};

  /**
   * Set chart mutated dataSets
   *
   * @event onChartUpdate
   * @param {Array} updatedDataSets
   * @returns {void}
   */
  const onChartUpdate = updatedDataSets => {
    console.log('>>>> graph card dataset', settings, other, updatedDataSets);
    // return setChartDataSets(updatedDataSets);
  };
  /*
  const onChartUpdate = useCallback(
    updatedDataSets => {
      console.log('>>>> graph card chart update', updatedDataSets);
      return setChartDataSets(prevState =>
        prevState.length ? prevState.map((_, index) => updatedDataSets[index]) : updatedDataSets
      );
    },
    [setChartDataSets]
  );
  */

  if (updatedActionDisplay) {
    cardHeaderProps.actions = {
      className: `curiosity-card__actions ${(error && 'blur') || ''}`,
      actions: (
        <Toolbar className="curiosity-toolbar" collapseListedFiltersBreakpoint="sm">
          <ToolbarContent className="curiosity-toolbar__content">
            <ToolbarGroup align={{ default: 'alignRight' }}>{updatedActionDisplay}</ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      )
    };
  }

  return (
    <Card isPlain className="curiosity-card curiosity-graph-card curiosity-usage-graph">
      <CardHeader className="curiosity-card__header" {...cardHeaderProps}>
        <CardTitle className="curiosity-card__title">
          <Title headingLevel="h2" size="lg">
            {t('curiosity-graph.cardHeading', { context: stringId })}
            <GraphCardChartTitleTooltip />
          </Title>
        </CardTitle>
      </CardHeader>
      <MinHeight key="bodyMinHeight">
        <CardBody className="curiosity-card__body">
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && (
              <Chart
                {...graphCardHelpers.generateExtendedChartSettings({ settings, granularity })}
                dataSets={dataSets}
                onUpdate={({ datum }) => onChartUpdate(datum)}
                chartLegend={({ chart, datum }) => <GraphCardChartLegend chart={chart} datum={datum} />}
                chartTooltip={({ datum }) => <GraphCardChartTooltip datum={datum} />}
              />
            )}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{useGraphCardContext: Function, useProductGraphTallyQuery: Function, t: Function,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.propTypes = {
  t: PropTypes.func,
  useChartDataSets: PropTypes.func,
  useGetMetrics: PropTypes.func,
  useGraphCardActions: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProductGraphTallyQuery: Function, t: translate,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.defaultProps = {
  t: translate,
  useChartDataSets,
  useGetMetrics,
  useGraphCardActions,
  useGraphCardContext,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
