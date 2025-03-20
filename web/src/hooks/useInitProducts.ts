import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { ProductsAllRequestType } from '../../../types/api/product/ProductsAllRequestType';
import { ProductsAllResponseType } from '../../../types/api/product/ProductsAllResponseType';
import { ProductType } from '../../../types/internal/ProductType';
import { ProductsContextType } from '../contexts/AppContext';

export interface UseInitProductsProps {
  locale: string;
  currency: string;
}

const useInitProducts = (props: UseInitProductsProps): ProductsContextType => {
  const [products, setProducts] = React.useState<ProductType[]>([]);

  const syncProducts = async () => {
    const response = await FirebaseFunctionsModule<
      ProductsAllRequestType,
      ProductsAllResponseType
    >().call('/product/products/all', {}, props.locale, props.currency);
    setProducts(response.products);
  };

  React.useEffect(() => {
    syncProducts();
  }, [props.currency, props.locale]);

  const refresh = async () => {
    await syncProducts();
  };

  return {
    get: products,
    set: setProducts,
    refresh,
  };
};

export default useInitProducts;
