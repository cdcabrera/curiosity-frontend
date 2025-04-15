import { useProductOnload } from './productViewContext';

/**
 * @memberof ProductView
 * @module ProductViewConfig
 */

/**
 * Apply contextual product configuration loading.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {useProductConfig} [props.useProductOnload=useProductConfig]
 * @returns {JSX.Element}
 */
const ProductViewLoad = ({ children, useProductOnload: useAliasProductOnload = useProductOnload }) => {
  // const { isReady } = useAliasProductOnload();
  // useAliasProductOnload();
  // console.log('>>>>> IS READY', isReady);

  // if (isReady === true) {
  return children;
  // }

  // return null;
};

export { ProductViewLoad as default, ProductViewLoad };
