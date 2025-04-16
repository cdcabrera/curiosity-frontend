import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { BinocularsIcon } from '@patternfly/react-icons';
import { MessageView } from '../messageView/messageView';
import { translate } from '../i18n/i18n';

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
const ProductViewConfigLoad = ({ children, t = translate }) => {
  const [isReady, setIsReady] = useState(false);

  useMount(async () => {
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

export { ProductViewConfigLoad as default, ProductViewConfigLoad };
