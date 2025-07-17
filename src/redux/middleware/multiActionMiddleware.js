/**
 * @memberof Middleware
 * @module MultiActionMiddleware
 */

/**
 * Allow passing an array of actions for batch dispatch.
 *
 * @param {object} store
 * @returns {Function}
 */
const multiActionMiddleware = store => next => action =>
  (Array.isArray(action) &&
    action.map(a => {
      if (a?.type) {
        return store.dispatch(a);
      }
      return store.dispatch({ type: 'SKIP_ACTION' });
    })) ||
  next(action);

export { multiActionMiddleware as default, multiActionMiddleware };
