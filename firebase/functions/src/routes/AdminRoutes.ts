import * as express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { ProductCreateUpdateRequestType } from '../../../../types/api/admin/ProductCreateUpdateRequestType';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { ProductCreateUpdateResponseType } from '../../../../types/api/admin/ProductCreateUpdateResponseType';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from '../../../../types/internal/UserType';

const AdminRoutes = express.Router();

AdminRoutes.all(
  '/product/createUpdate',
  checkSchema({
    uid: {
      in: 'body',
      optional: true,
      notEmpty: true,
      isString: true,
    },
    'product.name.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.description.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.variations.*.name.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.variations.*.description.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.variations.*.price': {
      in: 'body',
      isInt: true,
      toInt: true,
    },
    'product.variations.*.images.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.tags.*.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'product.badge.type': {
      in: 'body',
      optional: true,
      isIn: {
        options: [['success', 'danger', 'info', 'warning']],
      },
    },
    'product.badge.text.*': {
      in: 'body',
      optional: true,
      notEmpty: true,
      isString: true,
    },
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async (req, res) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400).send(validation.array());
      return;
    }

    const user = req.user as UserType | null;

    if (!user || !user.isAdmin) {
      res.status(401).send();
      return;
    }

    const request: ProductCreateUpdateRequestType = req.body;
    let product: ProductType | null = null;

    if (request.uid) {
      await FirestoreModule<ProductType>().writeDoc('products', request.uid, {
        ...request.product,
        uid: request.uid,
      });

      product = await FirestoreModule<ProductType>().getDoc(
        'products',
        request.uid
      );
    } else {
      const uid = uuidv4();
      await FirestoreModule<ProductType>().writeDoc('products', uid, {
        ...request.product,
        uid,
      });

      product = await FirestoreModule<ProductType>().getDoc('products', uid);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    const response: ResponseType<ProductCreateUpdateResponseType> = {
      data: {
        product,
      },
    };

    res.send(response);
    return;
  }
);

export default AdminRoutes;
