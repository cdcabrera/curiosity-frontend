import React, { useContext, useState, useCallback, useMemo } from 'react';
import { useProduct } from '../productView/productViewContext';
import { helpers } from '../../common/helpers';

/**
 * @memberof Components
 * @module BannerMessagesContext
 */

/**
 * Banner messages context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = {
  bannerMessages: {},
  setBannerMessages: helpers.noop,
  removeBannerMessages: helpers.noop
};

const BannerMessagesContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated banner messages context.
 *
 * @returns {React.Context<{}>}
 */
const useBannerMessagesContext = () => useContext(BannerMessagesContext);

/**
 * Banner messages provider.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
const BannerMessagesProvider = ({ children }) => {
  const [bannerMessages, setBannerMessagesState] = useState({});

  /**
   * Set banner messages for a specific product ID.
   *
   * @param {string} productId
   * @param {Array|object} messages
   */
  const setBannerMessages = useCallback((productId, messages) => {
    if (!productId) {
      return;
    }

    setBannerMessagesState(prev => {
      const current = prev[productId] || [];
      const incoming = (Array.isArray(messages) ? messages : [messages])
        .map(value => {
          if (value?.id || value?.title || value?.message) {
            return {
              ...value,
              id: value?.id || value?.title || value?.message
            };
          }

          if (typeof value === 'string' || typeof value === 'number') {
            return {
              id: value,
              title: value
            };
          }

          return undefined;
        })
        .filter(value => value?.id !== undefined && Object.keys(value).length > 1);

      const updatedMessages = [...current];

      incoming.forEach(message => {
        const index = updatedMessages.findIndex(msg => msg.id === message.id);

        if (index > -1) {
          updatedMessages[index] = message;
        } else {
          updatedMessages.push(message);
        }
      });

      return {
        ...prev,
        [productId]: updatedMessages
      };
    });
  }, []);

  /**
   * Remove banner messages for a specific product ID.
   *
   * @param {string} productId
   * @param {string} idTitle
   */
  const removeBannerMessages = useCallback((productId, idTitle) => {
    if (!productId) {
      return;
    }

    setBannerMessagesState(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(message => message.id !== idTitle && message.title !== idTitle)
    }));
  }, []);

  /**
   * Expose banner messages context methods
   *
   * @type {{bannerMessages: {}, setBannerMessages: Function, removeBannerMessages: Function}}
   */
  const value = useMemo(
    () => ({
      bannerMessages,
      setBannerMessages,
      removeBannerMessages
    }),
    [bannerMessages, setBannerMessages, removeBannerMessages]
  );

  return <BannerMessagesContext.Provider value={value}>{children}</BannerMessagesContext.Provider>;
};

/**
 * Hook to retrieve banner messages for the current product.
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useBannerMessagesContext} [options.useBannerMessagesContext=useBannerMessagesContext]
 * @returns {Array}
 */
const useBannerMessages = ({
  useProduct: useAliasProduct = useProduct,
  useBannerMessagesContext: useAliasBannerMessagesContext = useBannerMessagesContext
} = {}) => {
  const { productId } = useAliasProduct();
  const { bannerMessages } = useAliasBannerMessagesContext();

  return useMemo(() => bannerMessages?.[productId] || [], [bannerMessages, productId]);
};

/**
 * Hook to remove banner messages for the current product.
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useBannerMessagesContext} [options.useBannerMessagesContext=useBannerMessagesContext]
 * @returns {Function}
 */
const useRemoveBannerMessages = ({
  useProduct: useAliasProduct = useProduct,
  useBannerMessagesContext: useAliasBannerMessagesContext = useBannerMessagesContext
} = {}) => {
  const { productId } = useAliasProduct();
  const { removeBannerMessages } = useAliasBannerMessagesContext();

  return useCallback(idTitle => removeBannerMessages(productId, idTitle), [productId, removeBannerMessages]);
};

/**
 * Hook to set banner messages for the current product.
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useBannerMessagesContext} [options.useBannerMessagesContext=useBannerMessagesContext]
 * @returns {Function}
 */
const useSetBannerMessages = ({
  useProduct: useAliasProduct = useProduct,
  useBannerMessagesContext: useAliasBannerMessagesContext = useBannerMessagesContext
} = {}) => {
  const { productId } = useAliasProduct();
  const { setBannerMessages } = useAliasBannerMessagesContext();

  return useCallback(messages => setBannerMessages(productId, messages), [productId, setBannerMessages]);
};

const context = {
  BannerMessagesContext,
  BannerMessagesProvider,
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages
};

export {
  context as default,
  context,
  BannerMessagesContext,
  BannerMessagesProvider,
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages
};
