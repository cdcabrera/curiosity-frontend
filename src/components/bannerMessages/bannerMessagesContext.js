import React, { useCallback, useEffect } from 'react';
import { useMount } from 'react-use';
import { AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { helpers } from '../../common/helpers';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof BannerMessages
 * @module BannerMessagesContext
 */

/**
 * Retrieve, set and remove application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{ bannerMessages: Array, setBannerMessages: Function, removeBannerMessages: Function }}
 */
const useBannerMessages = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  return useAliasSelector(({ messages }) => messages?.bannerMessages?.[productId], []);
};

/**
 * Provide a callback for removing application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useBannerMessages
 * @returns {Function}
 */
const useRemoveBannerMessages = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useBannerMessages: useAliasBannerMessages = useBannerMessages
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const bannerMessages = useAliasBannerMessages();

  /**
   * Remove a banner message from state.
   *
   * @callback removeBannerMessages
   * @param {string} idTitle
   */
  return useCallback(
    idTitle => {
      if (productId && Array.isArray(bannerMessages) && bannerMessages.length) {
        const filteredMessages = bannerMessages.filter(({ id, title }) => id !== idTitle && title !== idTitle);

        dispatch({
          type: reduxTypes.message.SET_BANNER_MESSAGES,
          viewId: productId,
          bannerMessages: filteredMessages || []
        });
      }
    },
    [bannerMessages, dispatch, productId]
  );
};

/**
 * Provide a callback for setting application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useBannerMessages
 * @returns {Function}
 */
const useSetBannerMessages = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useBannerMessages: useAliasBannerMessages = useBannerMessages
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const bannerMessages = useAliasBannerMessages();

  /**
   * Set application messages for banner display
   *
   * @callback setBannerMessages
   * @param {Array|{ id: string, message: string, title: string, variant: string }} messages
   */
  return useCallback(
    messages => {
      if (productId) {
        const updatedMessages = (Array.isArray(messages) && messages) || [messages];

        dispatch({
          type: reduxTypes.message.SET_BANNER_MESSAGES,
          viewId: productId,
          bannerMessages: [
            ...(bannerMessages || []),
            ...updatedMessages
              .map(value => {
                if (value?.id || value?.title || value?.message || value?.variant) {
                  return value;
                }

                if (typeof value === 'string' || typeof value === 'number') {
                  return {
                    id: value,
                    title: value
                  };
                }

                return undefined;
              })
              .filter(value => value !== undefined)
          ]
        });
      } else if (helpers.DEV_MODE) {
        console.warn(
          'Banner messages currently require the use of "product id". Product context is unavailable, try moving your banner message "set" lower in the component order.'
        );
      }
    },
    [bannerMessages, dispatch, productId]
  );
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

  useMount(() => {
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
            <Button
              isInline
              component="a"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              target="_blank"
              href={helpers.UI_LINK_LEARN_MORE}
            />
          ]
        )
      });
    }
  });
};

const context = {
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages,
  useUsageBanner
};

export {
  context as default,
  context,
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages,
  useUsageBanner
};
