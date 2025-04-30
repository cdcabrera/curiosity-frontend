import React, { useEffect } from 'react';
import { Button, clipboardCopyFunc } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import { Tooltip } from '../tooltip/tooltip';
import { translate } from '../i18n/i18nHelpers';

const BannerMessagesClipboard = ({ alertVariant, data, children, t = translate }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  useEffect(() => {
    if (isCopied === true) {
      window.setTimeout(() => setIsCopied(false), 700);
    }
  }, [isCopied]);

  const onClick = () => {
    clipboardCopyFunc(undefined, data);
    setIsCopied(true);
  };

  return (
    <Tooltip content={t('curiosity-banner.clipboard', { context: ['copy', isCopied && 'success'] })}>
      <Button
        className={`curiosity-banner-messages__clipboard-copy-text ${(alertVariant && `curiosity-banner-messages__clipboard-copy-text-${alertVariant}`) || ''}`}
        isInline
        variant="link"
        icon={<CopyIcon />}
        iconPosition="right"
        onClick={onClick}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
export { BannerMessagesClipboard as default, BannerMessagesClipboard };
