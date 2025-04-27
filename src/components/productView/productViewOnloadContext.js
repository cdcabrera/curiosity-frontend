import React, { useEffect } from 'react';
import { AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useProduct, useProductBillingAccountsQuery, useProductViewContext } from './productViewContext';
import { useSetBannerMessages } from '../bannerMessages/bannerMessagesContext';
import { reduxActions, storeHooks } from '../../redux';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18nHelpers';

/**
 * Product view onload hooks. Hooks intended to fire AFTER product query and configuration is set.
 *
 * @memberof ProductViewOnload
 * @module ProductViewOnloadContext
 */

/**
 * Onload product apply conditional state dispatch services.
 *
 * @param {object} options
 * @param {reduxActions.rhsm.getBillingAccounts} [options.getBillingAccounts=reduxActions.rhsm.getBillingAccounts]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProductViewContext} [options.useProductViewContext=useProductViewContext]
 * @param {useProductBillingAccountsQuery} [options.useProductBillingAccountsQuery=useProductBillingAccountsQuery]
 * @param {storeHooks.reactRedux.useSelectorsResponse} [options.useSelectorsResponse=useSelectorsResponse]
 * @returns {{data: object, productId: string, pending: boolean, isReady: boolean, fulfilled: boolean,
 *     responses: object}}
 */
const useProductOnload = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductViewContext: useAliasProductViewContext = useProductViewContext,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { onloadProduct, productId } = useAliasProductViewContext();
  const billingAccountsQuery = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const isBillingAccountRequired =
    onloadProduct?.find(value => value === rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;

  const selectors = [];
  if (isBillingAccountRequired) {
    selectors.push({ id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] });
  }
  const response = useAliasSelectorsResponse(selectors);

  useEffect(() => {
    if (isBillingAccountRequired) {
      dispatch(getBillingAccounts(productId, billingAccountsQuery));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBillingAccountRequired, productId]);

  return {
    ...response,
    isReady: !onloadProduct?.length || response?.fulfilled || false,
    productId
  };
};

const useUsageBanner = ({
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useSetBannerMessages: useAliasSetBannerMessages = useSetBannerMessages
} = {}) => {
  const setBannerMessages = useAliasSetBannerMessages();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  const isUsageError = data?.isUsageError || false;

  useEffect(() => {
    if (isUsageError === true) {
      const { hasUniqueAccounts, hasUniqueProviders, accounts, providers } = data.usageMetrics;
      const message = {};
      // const pluralCount = [];

      // look at moving these over to the transformer
      if (hasUniqueAccounts) {
        accounts?.forEach(({ id, provider }) => {
          message[provider] ??= [];
          message[provider].push(id);
          // pluralCount.push(id);
        });
      }

      // look at moving these over to the transformer
      if (hasUniqueProviders) {
        providers?.forEach(({ id, provider }) => {
          message[provider] ??= [];
          message[provider].push(id);
          // pluralCount.push(id);
        });
      }

      // console.log('>>>> BUSTED MESSAGE', message);

      /*
       * const providersAccounts = Object.entries(message)
       *  .map(([key, value]) => `${key}:${value}`)
       *  .join(', ');
       */

      /*
       * let firstProvider;
       * let firstAccount;
       */

      const [firstProvider, firstProviderAccounts] = Object.entries(message).shift();

      console.log('>>>>>>>>>>> HOOK 001', data);
      console.log('>>>>>>>>>>> HOOK 001', message);
      console.log('>>>>>>>>>>> HOOK 001', firstProvider, firstProviderAccounts);
      /*
       *console.log('>>>> FIRST ENTRY', firstProvider, firstProviderAccounts);
       *
       *console.log(
       *  '>>>> COUNT',
       *  Object.keys(message).length === 2 && 2,
       *  Object.keys(message).length > 2 && Object.keys(message).length - 1,
       *  Object.keys(message).length === 2 && 1,
       *  Object.entries(message)[0][1].length > 2 && Object.entries(message)[0][1].length - 1,
       *  0
       *);
       */

      setBannerMessages({
        variant: AlertVariant.warning,
        id: 'somethings broken',
        title: t('curiosity-banner.usage', { context: ['title'], product: productId }),
        message: t(
          'curiosity-banner.usage',
          {
            context: ['description'],
            // trigger remaining copy with plural
            count: (Object.keys(message).length >= 2 && 2) || (Object.entries(message)[0][1].length > 2 && 2) || 0,

            /*
             * (Object.keys(message).length === 2 && 2) ||
             * (Object.keys(message).length > 2 && Object.keys(message).length - 1) ||
             * (Object.keys(message).length === 2 && 1) ||
             * (Object.entries(message)[0][1].length > 2 && Object.entries(message)[0][1].length - 1) ||
             * 0,
             */
            /*
             * (Object.keys(message).length === 1 && Object.entries(message)[0][1].length) ||
             * pluralCount.length,
             */
            remaining: t('curiosity-banner.usage', {
              context: ['description', 'remaining', Object.keys(message).length >= 2 && 'provider'],
              count:
                (Object.keys(message).length === 2 && 1) ||
                (Object.keys(message).length > 2 && Object.keys(message).length - 1) ||
                (Object.keys(message).length === 2 && 1) ||
                (Object.entries(message)[0][1].length > 2 && Object.entries(message)[0][1].length - 1) ||
                0
            }),
            provider: firstProvider,
            account: firstProviderAccounts[0]
            // providersAccounts
          },
          [
            <strong />,
            <Button
              isInline
              component="a"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              target="_blank"
              href={helpers.UI_LINK_USAGE_SUBSCRIPTIONS}
            />
          ]
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsageError]);
};

const context = {
  useProductOnload,
  useUsageBanner
};

export { context as default, context, useProductOnload, useUsageBanner };
