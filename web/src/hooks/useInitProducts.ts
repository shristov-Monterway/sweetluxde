import { ProductType } from '../../../types/internal/ProductType';
import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { ProductsAllRequestType } from '../../../types/api/product/ProductsAllRequestType';
import { ProductsAllResponseType } from '../../../types/api/product/ProductsAllResponseType';

export interface UseInitProductsProps {
  locale: string;
  currency: string;
}

const useInitProducts = (props: UseInitProductsProps): ProductType[] => {
  const [products, setProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    const syncProducts = async () => {
      const response = await FirebaseFunctionsModule<
        ProductsAllRequestType,
        ProductsAllResponseType
      >().call('/product/products/all', {}, props.locale, props.currency);
      setProducts(response.products);
    };

    syncProducts();
  }, [props.currency, props.locale]);

  return products;
};

export default useInitProducts;
