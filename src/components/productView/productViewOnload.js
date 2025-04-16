import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { BinocularsIcon } from '@patternfly/react-icons';
import { MessageView } from '../messageView/messageView';
import { translate } from '../i18n/i18n';
import { useProductOnload } from './productViewContext';

/**
 * @memberof ProductView
 * @module ProductViewConfigLoad
 */

/**
 * Product conditional configuration loading.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const ProductViewOnload = ({ children, t = translate, useProductOnload: useAliasProductOnload = useProductOnload }) => {
  const [isReady, setIsReady] = useState(false);
  const { isReady: isReallyReady } = useAliasProductOnload();

  useMount(async () => {
    console.log('>>>>> isReallyReady', isReallyReady);
    window.setTimeout(() => {
      setIsReady(true);
    }, 1000);
  });

  if (isReady) {
    return children;
  }

  return (
    <MessageView
      pageTitle="&nbsp;"
      message={t('curiosity-view.pending', { context: 'description' })}
      icon={<BinocularsIcon />}
    />
  );
};

export { ProductViewOnload as default, ProductViewOnload };
