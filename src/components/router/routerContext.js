import { useCallback, useMemo, useState, useEffect } from 'react';
import _memoize from 'lodash/memoize';
// import { useShallowCompareEffect } from 'react-use';
import {
  useLocation as useLocationRRD,
  useNavigate as useRRDNavigate,
  // useParams as useRRDParams,
  useSearchParams as useRRDSearchParams
} from 'react-router-dom';
import { routerHelpers } from './routerHelpers';

/**
 * ToDo: Review react-router-dom useParams once v6 updates are in env
 * During implementation testing react-router-dom "useParams" was helping spawn multiple
 * component refreshes so we rolled our own.
 *
 * We were unable to tell if this was a combination of
 * using the proxy combined with v5 of router. The most noticeable double (to sometimes triple)
 * refresh is jumping between OpenShift Subs and RHEL Subs, unclear if there's some
 * special left navigation at play here, or simply the lazy load of the component associated with
 * the path.
 *
 * On a personal note...
 * react-router has always been between the category of "close enough" and "[roll your own router or ... not]"...
 * this new version doesn't do itself any favors, it tries to do more and ends up just
 * offsetting some of the odd original loading issues we had. The current goal is to just
 * get something working close enough.
 */
/**
 * We ignore react router doms useParams.
 *
 * @returns {{productPath: string}}
 */
const useParams = () => {
  const productPath = routerHelpers.dynamicProductParameter();
  console.log('>>>> run set params', productPath);
  return { productPath };
};

/*
const useParams = ({ useParams: useAliasParams = useRRDParams } = {}) => {
  const { productPath } = useAliasParams();
  // return { productPath };
  /*
  const { productPath } = useAliasParams();
  const [updatedProductPath, setUpdatedProductPath] = useState(productPath);
  console.log('>>>> run set params', productPath);

  useEffect(() => {
    if (productPath !== updatedProductPath) {
      console.log('>>>> UPDATE SET PARAMS', productPath);
      setUpdatedProductPath(productPath);
    }
  }, [productPath, updatedProductPath]);

  return { productPath: updatedProductPath };
  * /

  console.log('>>>> run params', productPath);

  return useMemo(() => {
    console.log('>>>> SET PARAMS', productPath);
    return { productPath };
  }, [productPath]);

  /*
  useShallowCompareEffect(() => {
    // useShallowCompare
    // useDeepCompare
    // if (!_isEqual(updatedParams, params)) {
    console.log('>>>> UPDATE SET PARAMS', params);
    setUpdatedParams(params);
    // }
  }, [params]);
  * /
};
 */

/**
 * Combine react-router-dom useLocation with actual window location.
 * Focused on exposing replace and href.
 *
 * @param {Function} useLocation
 * @returns {{search, replace: Function, href, hash}}
 */
const useLocation = ({ useLocation: useAliasLocation = useLocationRRD } = {}) => {
  const location = useAliasLocation();
  const { location: windowLocation } = window;

  return useMemo(
    () => ({
      ...location,
      ...windowLocation,
      replace: path => windowLocation.replace(path),
      hash: location?.hash || '',
      set href(path) {
        windowLocation.href = path;
      },
      search: location?.search || ''
    }),
    [location, windowLocation]
  );
};

/**
 * Return a callback for redirecting, and replacing, towards a new path, or url.
 *
 * @callback redirect
 * @param {object} options
 * @param {Function} options.useLocation
 * @returns {(function(*): void)|*}
 */
const useRedirect = ({ useLocation: useAliasLocation = useLocation } = {}) => {
  const { hash = '', search = '', ...location } = useAliasLocation() || {};
  /**
   * redirect
   *
   * @param {string} route
   * @returns {void}
   */
  return useCallback(
    (route, { isReplace = true } = {}) => {
      const baseName = routerHelpers.dynamicBaseName();
      let isUrl;

      try {
        isUrl = !!new URL(route);
      } catch (e) {
        isUrl = false;
      }

      const updatedRoute = (isUrl && route) || `${routerHelpers.pathJoin(baseName, route)}${search}${hash}`;

      if (isReplace) {
        location.replace(updatedRoute);
        return;
      }

      location.href = updatedRoute;
    },
    [hash, location, search]
  );
};

/**
 * Get a route detail from router context.
 *
 * @param {object} options
 * @param {Function} options.useParams
 * @returns {{baseName: string, errorRoute: object}}
 */
const useRouteDetail = ({ useParams: useAliasParams = useParams } = {}) => {
  const { productPath } = useAliasParams();
  console.log('>>> use route detail', productPath);

  const doIt = _memoize(pp => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: pp });
    console.log('>>> SET ROUTE DETAIL', pp, configs.length, firstMatch?.productGroup);
    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    };
  });

  return doIt(productPath);
  /*
  return useMemo(() => {
    const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
    console.log('>>> SET ROUTE DETAIL', productPath, configs.length, firstMatch?.productGroup);
    return {
      allProductConfigs: allConfigs,
      firstMatch,
      errorRoute: routerHelpers.errorRoute,
      productGroup: firstMatch?.productGroup,
      productConfig: (configs?.length && configs) || []
    };
  }, [productPath]);
  */
  /*
  const { productPath } = useAliasParams();
  const { allConfigs, configs, firstMatch } = routerHelpers.getRouteConfigByPath({ pathName: productPath });
  console.log('>>> USE ROUTE DETAIL', productPath, configs.length, firstMatch?.productGroup);

  return {
    allProductConfigs: allConfigs,
    firstMatch,
    errorRoute: routerHelpers.errorRoute,
    productGroup: firstMatch?.productGroup,
    productConfig: (configs?.length && configs) || []
  };
  */
};

/**
 * useNavigate wrapper, apply application config context routing
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useNavigate
 * @returns {Function}
 */
const useNavigate = ({
  useLocation: useAliasLocation = useLocation,
  useNavigate: useAliasNavigate = useRRDNavigate
} = {}) => {
  const { search, hash } = useAliasLocation();
  const navigate = useAliasNavigate();

  return useCallback(
    (pathLocation, options) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { firstMatch } = routerHelpers.getRouteConfigByPath({ pathName });

      return navigate(
        (firstMatch?.productPath && `${routerHelpers.pathJoin('.', firstMatch?.productPath)}${search}${hash}`) ||
          (pathName && `${pathName}${search}${hash}`) ||
          pathLocation,
        options
      );
    },
    [hash, navigate, search]
  );
};

/**
 * Search parameter, return
 *
 * @param {object} options
 * @param {Function} options.useLocation
 * @param {Function} options.useSearchParams
 * @returns {Array}
 */
const useSearchParams = ({
  useSearchParams: useAliasSearchParams = useRRDSearchParams,
  useLocation: useAliasLocation = useLocation
} = {}) => {
  const { search } = useAliasLocation();
  const [, setAliasSearchParams] = useAliasSearchParams();

  /**
   * Alias returned React Router Dom useSearchParams hook to something expected.
   * Defaults to merging search objects instead of overwriting them.
   *
   * @param {object} updatedQuery
   * @param {object} options
   * @param {boolean} options.isMerged Merge search with existing search, or don't
   * @param {string|*} options.currentSearch search returned from useLocation
   */
  const setSearchParams = useCallback(
    (updatedQuery, { isMerged = true, currentSearch = search } = {}) => {
      let updatedSearch = {};

      if (isMerged) {
        Object.assign(updatedSearch, routerHelpers.parseSearchParams(currentSearch), updatedQuery);
      } else {
        updatedSearch = updatedQuery;
      }

      setAliasSearchParams(updatedSearch);
    },
    [search, setAliasSearchParams]
  );

  return [routerHelpers.parseSearchParams(search), setSearchParams];
};

const context = {
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};

export {
  context as default,
  context,
  useLocation,
  useNavigate,
  useParams,
  useRedirect,
  useRouteDetail,
  useSearchParams
};
