import React, { useEffect } from 'react';
import { Button, clipboardCopyFunc, Modal, ModalVariant } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import { translate } from '../i18n/i18nHelpers';

const BannerMessagesModal = ({ alertVariant, modalTitle, modalContent = '...', children, t = translate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (isOpen === true) {
      // window.setTimeout(() => setIsOpen(false), 700);
    }
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  const onClick = () => {
    // clipboardCopyFunc(undefined, data);
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <Modal
        appendTo={document.querySelector('.curiosity')}
        onClose={onClose}
        title={modalTitle}
        isOpen={isOpen}
        variant={ModalVariant.small}
        actions={[
          <Button key="confirm" variant="secondary" onClick={onClose}>
            {t('curiosity-banner.label', { context: 'close' })}
          </Button>
        ]}
      >
        {modalContent}
      </Modal>
      <Button
        className={`curiosity-banner-messages__clipboard-copy-text ${(alertVariant && `curiosity-banner-messages__clipboard-copy-text-${alertVariant}`) || ''}`}
        isInline
        component="a"
        variant="link"
        icon={<CopyIcon />}
        iconPosition="right"
        onClick={onClick}
      >
        {children}
      </Button>
    </React.Fragment>
  );
};
export { BannerMessagesModal as default, BannerMessagesModal };
