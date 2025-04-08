import { useProductConfig } from './productViewContext';

/**
 * @memberof ProductView
 * @module ProductViewConfig
 */

/**
 * Apply contextual product configuration hooks.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {useProductConfig} [props.useProductConfig=useProductConfig]
 * @returns {JSX.Element}
 */
const ProductViewConfig = ({ children, useProductConfig: useAliasProductConfig = useProductConfig }) => {
  const response = useAliasSelectorsResponse([
    { id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] }
  ]);

  // const { pending, error, fulfilled } = useAliasProductConfig();
  console.log('>>>>>> productviewconfig', pending, error, fulfilled);

  if (pending === false && error === false && fulfilled === false) {
    return children;
  }

  return (fulfilled && children) || (error && 'Error') || 'Pending';
};

export { ProductViewConfig as default, ProductViewConfig };
