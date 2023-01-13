import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardTitle, Gallery, Title, PageSection } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { routerHelpers } from '../router';
import { useHistory } from '../router/routerContext';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Return a list of available products.
 *
 * @returns {Array}
 */
const filterAvailableProducts = () => {
  const { configs, allConfigs } = routerHelpers.getRouteConfigByPath();
  // console.log('>>> testing', configs, allConfigs.filter(({ isSearchable }) => isSearchable === true);
  return (configs.length && configs) || allConfigs;
};

/**
 * Render a missing product view.
 *
 * @fires onNavigate
 * @param {object} props
 * @param {number} props.availableProductsRedirect
 * @param {Function} props.t
 * @param {Function} props.useHistory
 * @returns {Node}
 */
const ProductViewMissing = ({ availableProductsRedirect, t, useHistory: useAliasHistory }) => {
  const history = useAliasHistory({ isSetAppNav: true });
  const availableProducts = filterAvailableProducts();

  useMount(() => {
    if (availableProducts.length <= availableProductsRedirect) {
      history.push(availableProducts[0].path);
    }
  });

  /**
   * On click, update history.
   *
   * @event onNavigate
   * @param {string} id
   * @returns {void}
   */
  const onNavigate = id => history.push(id);

  return (
    <PageLayout className="curiosity-missing-view">
      <PageHeader productLabel="missing">{t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME })}</PageHeader>
      <PageSection isFilled>
        <Gallery hasGutter>
          {availableProducts.map(({ productGroup, productId }) => (
            <Card key={`missingViewCard-${productId}`} isHoverable onClick={() => onNavigate(productId)}>
              <CardTitle>
                <Title headingLevel="h2" size="lg">
                  {t('curiosity-view.title', {
                    appName: helpers.UI_DISPLAY_NAME,
                    context: (Array.isArray(productId) && productId?.[0]) || productId
                  })}
                </Title>
              </CardTitle>
              <CardBody className="curiosity-missing-view__card-description">
                {t('curiosity-view.description', {
                  appName: helpers.UI_DISPLAY_NAME,
                  context: (Array.isArray(productGroup) && productGroup?.[0]) || productGroup
                })}
              </CardBody>
              <CardFooter>
                <Button
                  variant="link"
                  isInline
                  onClick={event => {
                    event.preventDefault();
                    onNavigate(productId);
                  }}
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{useHistory: Function, availableProductsRedirect: number, t: Function}}
 */
ProductViewMissing.propTypes = {
  availableProductsRedirect: PropTypes.number,
  t: PropTypes.func,
  useHistory: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useHistory: Function, availableProductsRedirect: number, t: translate}}
 */
ProductViewMissing.defaultProps = {
  availableProductsRedirect: 4,
  t: translate,
  useHistory
};

export { ProductViewMissing as default, ProductViewMissing };
