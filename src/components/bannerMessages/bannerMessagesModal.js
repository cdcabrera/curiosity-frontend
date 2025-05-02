import React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof BannerMessages
 * @module BannerMessagesModal
 */

/**
 * A self-contained modal wrapper for banner messages.
 *
 * @param {object} props
 * @param {success|warning|danger|info} [props.alertVariant] Used to apply a background color to the modal open link.
 * @param {React.ReactNode} [props.buttonIcon=InfoCircleIcon]
 * @param {React.ReactNode} [props.modalTitle]
 * @param {React.ReactNode} [props.modalContent]
 * @param {React.ReactNode} props.children
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const BannerMessagesModal = ({
  alertVariant,
  buttonIcon = <InfoCircleIcon />,
  modalTitle,
  modalContent = '...',
  children,
  t = translate
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onClick = () => {
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
        <div data-test="bannerMessageModalContent">{modalContent}</div>
      </Modal>
      <Button
        data-test="bannerMessageModalButton"
        className={`curiosity-banner-messages__clipboard-copy-text ${(alertVariant && `curiosity-banner-messages__clipboard-copy-text-${alertVariant}`) || ''}`}
        isInline
        component="a"
        variant="link"
        icon={buttonIcon}
        iconPosition="right"
        onClick={onClick}
      >
        {children}
      </Button>
    </React.Fragment>
  );
};
export { BannerMessagesModal as default, BannerMessagesModal };
