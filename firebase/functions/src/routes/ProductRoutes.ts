import * as express from 'express';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { ProductsAllResponseType } from '../../../../types/api/product/ProductsAllResponseType';
import ExchangeModule from '../modules/ExchangModule';
import Config from '../Config';
import FixtureModule from '../modules/FixtureModule';
import { ProductFixtureResponseType } from '../../../../types/api/product/ProductFixtureResponseType';

const ProductRoutes = express.Router();

ProductRoutes.all('/product/fixture', async (req, res) => {
  const product = FixtureModule().generateProduct();

  await FirestoreModule<ProductType>().writeDoc(
    'products',
    product.uid,
    product
  );

  const response: ResponseType<ProductFixtureResponseType> = {
    data: {},
  };

  res.send(response);
  return;
});

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
