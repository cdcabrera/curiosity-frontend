import React from 'react';
import * as reactRedux from 'react-redux';
// import { configure, mount, shallow } from 'enzyme';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { prettyDOM, queries, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';
import { setupDotenvFilesForEnv } from './build.dotenv';

/**
 * Set dotenv params.
 */
setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Set enzyme adapter.
 */
// configure({ adapter: new Adapter() });

/**
 * Conditionally skip "it" test statements.
 * Ex:
 *   skipIt(true)('should do a thing...', () => { ... });
 *
 * @param {*|boolean} value Any truthy value, typically used with environment variables
 *
 * @returns {*|jest.It}
 */
global.skipIt = value => (value && it?.skip) || it;

/**
 * Emulate for component checks
 */
jest.mock('i18next', () => {
  const Test = function () { // eslint-disable-line
    this.use = () => this;
    this.init = () => Promise.resolve();
    this.changeLanguage = () => Promise.resolve();
  };
  return new Test();
});

/**
 * Emulate for component checks
 */
jest.mock('lodash/debounce', () => jest.fn);

/**
 * We currently use a wrapper for useSelector, emulate for component checks
 */
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

/**
 * Emulate react router dom useLocation
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ hash: '', search: '' })
}));

/**
 * Add the displayName property to function based components. Makes sure that snapshot tests have named components
 * instead of displaying a generic "<Component.../>".
 *
 * @param {object} components
 */
const addDisplayName = components => {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (typeof component === 'function' && !component.displayName) {
      component.displayName = key;
    }
  });
};

addDisplayName(pfReactCoreComponents);
addDisplayName(pfReactChartComponents);

/**
 * Apply a global insights chroming object.
 *
 * @type {{chrome: {init: Function, navigation: Function, auth: {getUser: Function}, identifyApp: Function,
 *     getUserPermissions: Function, isBeta: Function, hideGlobalFilter: Function, on: Function}}}
 */
global.window.insights = {
  chrome: {
    appNavClick: Function.prototype,
    auth: {
      getUser: () =>
        new Promise(resolve =>
          resolve({
            identity: {
              account_number: '0',
              type: 'User'
            }
          })
        )
    },
    getBundleData: Function.prototype,
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype,
    updateDocumentTitle: Function.prototype
  }
};

/**
 * Emulate frontend-components hooks
 */
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    ...global.window.insights
  })
}));

/**
 * Mock an object property, restore with mockClear.
 * A consistent object property mock for scenarios where the property is not a function/Jest fails.
 *
 * @param {object} object
 * @param {string} property
 * @param {*} mockValue
 * @returns {{mockClear: Function}}
 */
global.mockObjectProperty = (object = {}, property, mockValue) => {
  const updatedObject = object;
  const originalProperty = updatedObject[property];
  updatedObject[property] = mockValue;

  return {
    mockClear: () => {
      updatedObject[property] = originalProperty;
    }
  };
};

/**
 * React testing for components using hooks.
 *
 * @param {React.ReactNode} component
 * @param {object} options
 * @param {Function} options.callback
 * @param {object} options.options
 *
 * @returns {Promise<null>}
 */
global.mountHookComponent = async (component, { callback, ...options } = {}) => {
  const getDisplayName = reactComponent =>
    reactComponent?.displayName ||
    reactComponent?.$$typeof?.displayName ||
    reactComponent?.$$typeof?.name ||
    reactComponent?.name ||
    reactComponent?.type.displayName ||
    reactComponent?.type.name;

  const componentInfo = {
    displayName: getDisplayName(component),
    props: {
      ...component?.props,
      children: React.Children.toArray(component?.props?.children).map(child => ({
        displayName: getDisplayName(child),
        props: child?.props,
        type: child?.type
      }))
    }
  };

  let mountedComponent = null;
  let setPropsProps = Function.prototype;
  let renderRest = {};
  await act(async () => {
    const { container, rerender, ...rest } = await render(component, { queries, ...options });
    mountedComponent = container;
    setPropsProps = rerender;
    renderRest = rest;
  });

  if (typeof callback === 'function') {
    await act(async () => {
      await callback({ component: mountedComponent });
    });
  }

  const mount = document.createElement(componentInfo?.displayName || 'element');
  mount.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
  mount.innerHTML = mountedComponent.innerHTML;
  mount.props = componentInfo.props;
  mount.setProps = async props => {
    // const Component = component;
    await act(async () => {
      await setPropsProps(<component {...props} />);
    });
  };

  mount.find = selector => {
    if (typeof selector !== 'string' && React.isValidElement(React.createElement(selector))) {
      const p = [];
      const loop = comp => {
        React.Children.toArray(comp).forEach(child => {
          if (React.isValidElement(child) && child.type === selector) {
            p.push(child);
          }

          if (child?.children || child?.props?.children) {
            loop(child?.children || child?.props?.children);
          }
        });
      };

      loop(component);

      return p;
    }

    try {
      return mount?.querySelector(selector);
    } catch (e) {
      return [];
    }
  };

  Object.entries(renderRest).forEach(([key, value]) => {
    mount[key] = value;
    /*
    if (typeof value === 'function') {
      mount[key] = async (...args) => value(...args);
    } else {
      mount[key] = value;
    }
    */
  });

  return mount;
};

global.mountHookWrapper = global.mountHookComponent;

/**
 * Enzyme for components using hooks.
 *
 * @param {React.ReactNode} component
 * @param {object} options
 * @param {Function} options.callback
 * @param {object} options.options
 *
 * @returns {Promise<null>}
 */
global.shallowHookComponent = global.mountHookComponent;

global.shallowHookWrapper = global.mountHookComponent;

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.mountHook = async (useHook = Function.prototype, { state } = {}) => {
  let result;
  let mountedHook;
  let unmountHook;
  let spyUseSelector;
  const Hook = () => {
    result = useHook();
    return null;
  };
  await act(async () => {
    if (state) {
      spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(state));
    }
    const { container, unmount } = await render(<Hook />);
    mountedHook = container;
    unmountHook = unmount;
  });

  const unmount = async () => {
    await act(async () => unmountHook());
  };

  if (state) {
    spyUseSelector.mockClear();
  }

  return { unmount, result };
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.shallowHook = (useHook = Function.prototype, { state } = {}) => {
  let result;
  let spyUseSelector;
  const Hook = () => {
    result = useHook();
    return null;
  };

  if (state) {
    spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(state));
  }

  const { unmount: unmountHook } = render(<Hook />);
  const unmount = () => unmountHook();

  if (state) {
    spyUseSelector.mockClear();
  }

  return { unmount, result };
};

/**
 * Generate a mock window location object, allow async.
 *
 * @param {Function} callback
 * @param {object} options
 * @param {string} options.url
 * @param {object} options.location
 * @returns {Promise<void>}
 */
global.mockWindowLocation = async (
  callback = Function.prototype,
  { url = 'https://ci.foo.redhat.com/subscriptions/rhel', location: locationProps = {} } = {}
) => {
  const updatedUrl = new URL(url);
  const updatedLocation = {
    href: updatedUrl.href,
    search: updatedUrl.search,
    hash: updatedUrl.hash,
    pathname: updatedUrl.pathname,
    replace: Function.prototype,
    ...locationProps
  };

  const { mockClear } = mockObjectProperty(window, 'location', updatedLocation);
  await callback(updatedLocation);

  return {
    mockClear
  };
};

// FixMe: revisit squashing log and group messaging, redux leaks log messaging
// ToDo: revisit squashing "popper" alerts
/*
 * For applying a global Jest "beforeAll", based on
 * jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 */
beforeAll(() => {
  const { error, group, log } = console;

  const interceptConsoleMessaging = (method, callback) => {
    console[method.name] = (message, ...args) => {
      const isValid = callback(message, ...args);
      if (isValid === true) {
        method.apply(console, [message, ...args]);
      }
    };
  };

  interceptConsoleMessaging(group, () => process.env.CI !== 'true');

  interceptConsoleMessaging(log, () => process.env.CI !== 'true');

  interceptConsoleMessaging(error, (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    }

    return !/(Not implemented: navigation)/gi.test(message) && !/Popper/gi.test(args?.[0]);
  });
});
