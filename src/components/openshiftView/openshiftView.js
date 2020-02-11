import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import GraphCard from '../graphCard/graphCard';
import { helpers } from '../../common';

class OpenshiftView extends React.Component {
  componentDidMount() {}

  render() {
    const { routeDetail, t } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={[
              { id: 'cores', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
              { id: 'threshold' }
            ]}
            productId={routeDetail.pathParameter}
            viewId={routeDetail.pathId}
            cardTitle={t('curiosity-graph.coresHeading')}
            productShortLabel="OpenShift"
          />
        </PageSection>
      </PageLayout>
    );
  }
}

OpenshiftView.propTypes = {
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  t: PropTypes.func
};

OpenshiftView.defaultProps = {
  t: helpers.noopTranslate
};

const TranslatedOpenshiftView = withTranslation()(OpenshiftView);

export { TranslatedOpenshiftView as default, TranslatedOpenshiftView, OpenshiftView };
