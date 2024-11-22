import * as express from 'express';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { ProductsAllResponseType } from '../../../../types/api/product/ProductsAllResponseType';
import ExchangeModule from '../modules/ExchangModule';
import Config from '../Config';

const ProductRoutes = express.Router();

ProductRoutes.all('/products/all', async (req, res) => {
  const products =
    await FirestoreModule<ProductType>().getCollection('products');

  const rate = await ExchangeModule().exchange(
    Config.defaultCurrency,
    req.currency
  );

  const exchangedProducts = products.map((product) => ({
    ...product,
    variations: Object.keys(product.variations).reduce(
      (productVariations, uid) => ({
        ...productVariations,
        [uid]: {
          ...product.variations[uid],
          price: Math.ceil(rate * product.variations[uid].price),
        },
      }),
      {}
    ),
  })) as unknown as ProductType[];

  const response: ResponseType<ProductsAllResponseType> = {
    data: {
      products: exchangedProducts,
    },
  };

  res.send(response);
  return;
});

export default ProductRoutes;
