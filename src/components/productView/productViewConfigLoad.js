import React, { useEffect } from 'react';
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
  useEffect(() => {
    console.log('>>>>> MOUNT CONFIG LOAD');
  });

  /*
  return (
    <MessageView
      pageTitle="&nbsp;"
      message={t('curiosity-view.pending', { context: 'description' })}
      icon={<BinocularsIcon />}
    />
  );
  */

  return children;
};

export { ProductViewConfigLoad as default, ProductViewConfigLoad };
