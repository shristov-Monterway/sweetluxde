import * as express from 'express';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { ProductsAllResponseType } from '../../../../types/api/product/ProductsAllResponseType';

const ProductRoutes = express.Router();

ProductRoutes.all('/products/all', async (req, res) => {
  const products =
    await FirestoreModule<ProductType>().getCollection('products');

  const response: ResponseType<ProductsAllResponseType> = {
    data: {
      products,
    },
  };

  res.send(response);
  return;
});

export default ProductRoutes;
