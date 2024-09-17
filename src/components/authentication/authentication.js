import React from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Button } from '@patternfly/react-core';
import { routerHelpers } from '../router';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { MessageView } from '../messageView/messageView';
import { OptinView } from '../optinView/optinView';
import { translate } from '../i18n/i18n';
import { AuthenticationContext, useGetAuthorization } from './authenticationContext';

/**
 * Authentication component wrapper.
 *
 * @memberof Components
 * @module Authentication
 * @property {module} AuthenticationContext
 */

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {string} props.appName
 * @param {React.ReactNode} props.children
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useGetAuthorization
 * @returns {React.ReactNode}
 */
const Authentication = ({ appName, children, isDisabled, t, useGetAuthorization: useAliasGetAuthorization }) => {
  const { pending, data = {} } = useAliasGetAuthorization();
  const { authorized = {}, errorCodes, errorStatus } = data;
  const { [appName]: isAuthorized } = authorized;

  const renderContent = () => {
    if (isDisabled) {
      return (
        <MessageView>
          <Maintenance description={t('curiosity-auth.maintenance', { context: 'description' })} />
        </MessageView>
      );
    }

    if (isAuthorized) {
      return children;
    }

    if (pending) {
      return (
        <MessageView
          pageTitle="&nbsp;"
          message={t('curiosity-auth.pending', { context: 'description' })}
          icon={BinocularsIcon}
        />
      );
    }

    // Look for error-codes, bring up OptIn
    if (
      (errorCodes && errorCodes.includes(rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN)) ||
      errorStatus === 418
    ) {
      return <OptinView />;
    }

    // Make the assumption that if one 5xx error is coming back, all calls are returning 5xx
    if (errorStatus >= 500) {
      return (
        <MessageView
          pageTitle={t('curiosity-auth.apiError', { context: 'pageTitle' })}
          title={t('curiosity-auth.apiError', { context: 'title', appName: helpers.UI_INTERNAL_NAME })}
          message={t('curiosity-auth.apiError', { context: 'description' }, [
            <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_PLATFORM_STATUS} />
          ])}
          icon={ExclamationCircleIcon}
        />
      );
    }

    return (
      <MessageView>
        <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
      </MessageView>
    );
  };

  return <AuthenticationContext.Provider value={data}>{renderContent()}</AuthenticationContext.Provider>;
};

/**
 * Prop types.
 *
 * @type {{useGetAuthorization: Function, children: React.ReactNode, appName: string, isDisabled: boolean}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  children: PropTypes.node.isRequired,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGetAuthorization: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGetAuthorization: Function, t: Function, appName: string, isDisabled: boolean}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  isDisabled: helpers.UI_DISABLED,
  t: translate,
  useGetAuthorization
};

export { Authentication as default, Authentication };
