import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { ProductsAllRequestType } from '../../../types/api/product/ProductsAllRequestType';
import {
  ProductDataType,
  ProductsAllResponseType,
} from '../../../types/api/product/ProductsAllResponseType';

export interface UseInitProductsProps {
  locale: string;
  currency: string;
}

const useInitProducts = (props: UseInitProductsProps): ProductDataType[] => {
  const [products, setProducts] = React.useState<ProductDataType[]>([]);

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
