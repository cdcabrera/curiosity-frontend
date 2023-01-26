import React from 'react';
// import { useMount } from 'react-use';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';
// import { ProductView } from '../productView/productView'; //

// ToDo: consider moving the filter for disabled routes towards routerHelpers
/**
 * Create and load routes.
 *
 * @param {object} props
 * @param {object} props.redirectRoute
 * @param {Array} props.routes
 * @returns {React.ReactNode}
 */
const Router = ({ redirectRoute, routes } = {}) => {
  /*
  const updatedRoutes = routes
    .filter(item => !item.disabled)
    .map(item => {
      const View = routerHelpers.importView(item.component);
      return <Route key={item.path} path={item.path} element={<View />} />;
    });
  */
  //
  /*
  const updatedRoutes = useCallback(
    async () =>
      Promise.all(
        routes
          .filter(item => !item.disabled)
          .map(async item => {
            const View = await routerHelpers.importView(item.component);
            return <Route key={item.path} path={item.path} element={<View />} />;
          })
      ),
    [routes]
  );
  */
  /*
  const [updatedRoutes, setUpdatedRoutes] = useState();

  useEffect(() => {
    const doit = routes
      .filter(item => !item.disabled)
      .map(item => {
        const View = routerHelpers.importView(item.component);
        return <Route key={item.path} path={item.path} element={<View />} />;
      });

    console.log('>>> routes mounted', doit);
    setUpdatedRoutes(doit);
  }, [routes]);
  */
  /*
  const updatedRoutes = useMemo(
    () =>
      routes
        .filter(item => !item.disabled)
        .map(item => {
          const View = routerHelpers.importView(item.component);
          return <Route key={item.path} path={item.path} element={<View />} />;
        }),
    [routes]
  );
  */

  const updatedRoutes = routes
    .filter(item => !item.disabled)
    .map(item => {
      const View = routerHelpers.importView(item.component);
      // const View = (/productView/i.test(item.component) && ProductView) || routerHelpers.importView(item.component);
      return <Route key={item.path} path={item.path} element={<View />} />;
    });

  console.log('>>> routes run', updatedRoutes);

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Routes>
        {updatedRoutes}
        {redirectRoute && (
          <Route key="redirect" path={redirectRoute.path} element={<Navigate replace to={redirectRoute.redirect} />} />
        )}
      </Routes>
    </React.Suspense>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array, redirectRoute: object}}
 */
Router.propTypes = {
  redirectRoute: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirect: PropTypes.string.isRequired
  }),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      path: PropTypes.string.isRequired
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array, redirectRoute: object}}
 */
Router.defaultProps = {
  redirectRoute: routerHelpers.redirectRoute,
  routes: routerHelpers.routes
};

export { Router as default, Router };
