import * as express from 'express';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import {
  ProductDataType,
  ProductsAllResponseType,
} from '../../../../types/api/product/ProductsAllResponseType';
import ExchangeModule from '../modules/ExchangModule';
import Config from '../Config';
import { CategoryType } from '../../../../types/internal/CategoryType';
import { CategoriesAllResponseType } from '../../../../types/api/product/CategoriesAllResponseType';

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

  const categories =
    await FirestoreModule<CategoryType>().getCollection('categories');

  const productsData: ProductDataType[] = exchangedProducts.map(
    (exchangedProduct) => ({
      ...exchangedProduct,
      categoriesData: categories.filter((category) =>
        exchangedProduct.categories.includes(category.uid)
      ),
    })
  );

  const response: ResponseType<ProductsAllResponseType> = {
    data: {
      products: productsData,
    },
  };

  res.send(response);
  return;
});

ProductRoutes.all('/categories/all', async (req, res) => {
  const categories =
    await FirestoreModule<CategoryType>().getCollection('categories');

  const response: ResponseType<CategoriesAllResponseType> = {
    data: {
      categories,
    },
  };

  res.send(response);
  return;
});

export default ProductRoutes;
