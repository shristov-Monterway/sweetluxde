import * as express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { ProductCreateUpdateRequestType } from '../../../../types/api/admin/ProductCreateUpdateRequestType';
import FirestoreModule from '../modules/FirestoreModule';
import { ProductType } from '../../../../types/internal/ProductType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { ProductCreateUpdateResponseType } from '../../../../types/api/admin/ProductCreateUpdateResponseType';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from '../../../../types/internal/UserType';
import { CurrencyType } from '../../../../types/internal/CurrencyType';
import { CurrencyRatesType } from '../../../../types/internal/CurrencyRatesType';
import ExchangeService from '../services/ExchangeService';
import Config from '../Config';
import { CurrenciesSyncResponseType } from '../../../../types/api/admin/CurrenciesSyncResponseType';
import FixtureModule from '../modules/FixtureModule';
import { ProductFixtureResponseType } from '../../../../types/api/admin/ProductFixtureResponseType';
import { PublicConfigReadResponseType } from '../../../../types/api/admin/PublicConfigReadResponseType';
import { PublicConfigType } from '../../../../types/internal/PublicConfigType';
import { CategoryType } from '../../../../types/internal/CategoryType';
import { CategoryCreateUpdateRequestType } from '../../../../types/api/admin/CategoryCreateUpdateRequestType';
import { CategoryCreateUpdateResponseType } from '../../../../types/api/admin/CategoryCreateUpdateResponseType';
import { CategoryDeleteRequestType } from '../../../../types/api/admin/CategoryDeleteRequestType';
import { CategoryDeleteResponseType } from '../../../../types/api/admin/CategoryDeleteResponseType';
import { ProductDeleteRequestType } from '../../../../types/api/admin/ProductDeleteRequestType';
import { ProductDeleteResponseType } from '../../../../types/api/admin/ProductDeleteResponseType';

const AdminRoutes = express.Router();

AdminRoutes.all(
  '/product/createUpdate',
  checkSchema({
    uid: {
      in: 'body',
      optional: true,
      custom: {
        options: (value) => {
          if (value === null || typeof value === 'string') {
            return true;
          }
          throw new Error('uid must be either null or a string');
        },
      },
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
    'product.variations.*.weight': {
      in: 'body',
      custom: {
        options: (value) => {
          if (value === null || typeof value === 'number') {
            return true;
          }
          throw new Error('weight must be either null or a string');
        },
      },
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

AdminRoutes.all(
  '/product/delete',
  checkSchema({
    uid: {
      in: 'body',
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

    const request: ProductDeleteRequestType = req.body;

    await FirestoreModule<ProductType>().deleteDoc('products', request.uid);

    const users = await FirestoreModule<UserType>().getCollection('users');

    for (const user of users) {
      if (
        !user.cart.lineItems
          .map((lineItem) => lineItem.product)
          .includes(request.uid) &&
        !user.wishlist.lineItems
          .map((lineItem) => lineItem.product)
          .includes(request.uid)
      ) {
        continue;
      }

      const cartIndexesToRemove: number[] = [];
      const wishlistIndexesToRemove: number[] = [];

      user.cart.lineItems.forEach((lineItem, index) => {
        if (lineItem.product === request.uid) {
          cartIndexesToRemove.push(index);
        }
      });

      user.wishlist.lineItems.forEach((lineItem, index) => {
        if (lineItem.product === request.uid) {
          wishlistIndexesToRemove.push(index);
        }
      });

      const newCartLineItems = user.cart.lineItems;
      const newWishlistLineItems = user.wishlist.lineItems;

      cartIndexesToRemove.sort((a, b) => b - a);
      wishlistIndexesToRemove.sort((a, b) => b - a);

      for (const cartIndexToRemove of cartIndexesToRemove) {
        if (
          cartIndexToRemove >= 0 &&
          cartIndexToRemove < newCartLineItems.length
        ) {
          newCartLineItems.splice(cartIndexToRemove, 1);
        }
      }

      for (const wishlistIndexToRemove of wishlistIndexesToRemove) {
        if (
          wishlistIndexToRemove >= 0 &&
          wishlistIndexToRemove < newWishlistLineItems.length
        ) {
          newWishlistLineItems.splice(wishlistIndexToRemove, 1);
        }
      }

      await FirestoreModule<UserType>().writeDoc('users', user.uid, {
        ...user,
        cart: {
          lineItems: newCartLineItems,
        },
        wishlist: {
          lineItems: newWishlistLineItems,
        },
      });
    }

    const response: ResponseType<ProductDeleteResponseType> = {
      data: {},
    };

    res.send(response);
    return;
  }
);

AdminRoutes.all(
  '/category/createUpdate',
  checkSchema({
    uid: {
      in: 'body',
      optional: true,
      custom: {
        options: (value) => {
          if (value === null || typeof value === 'string') {
            return true;
          }
          throw new Error('uid must be either null or a string');
        },
      },
    },
    'category.description.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'category.name.*': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'category.parentUid': {
      in: 'body',
      custom: {
        options: (value) => {
          if (value === null || typeof value === 'string') {
            return true;
          }
          throw new Error('parentUid must be either null or a string');
        },
      },
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

    const request: CategoryCreateUpdateRequestType = req.body;
    let category: CategoryType | null = null;

    if (request.uid) {
      if (
        request.category.parentUid !== null &&
        request.category.parentUid === request.uid
      ) {
        res.status(400).send();
        return;
      }

      await FirestoreModule<CategoryType>().writeDoc(
        'categories',
        request.uid,
        {
          ...request.category,
          uid: request.uid,
        }
      );

      category = await FirestoreModule<CategoryType>().getDoc(
        'categories',
        request.uid
      );
    } else {
      const uid = uuidv4();
      await FirestoreModule<CategoryType>().writeDoc('categories', uid, {
        ...request.category,
        uid,
      });

      category = await FirestoreModule<CategoryType>().getDoc(
        'categories',
        uid
      );
    }

    if (!category) {
      throw new Error('Category not found');
    }

    const response: ResponseType<CategoryCreateUpdateResponseType> = {
      data: {
        category,
      },
    };

    res.send(response);
    return;
  }
);

AdminRoutes.all(
  '/category/delete',
  checkSchema({
    uid: {
      in: 'body',
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

    const request: CategoryDeleteRequestType = req.body;

    await FirestoreModule<CategoryType>().deleteDoc('categories', request.uid);

    const categories =
      await FirestoreModule<CategoryType>().getCollection('categories');

    for (const category of categories) {
      if (category.parentUid === request.uid) {
        const newCategory: CategoryType = {
          ...category,
          parentUid: null,
        };
        await FirestoreModule<CategoryType>().writeDoc(
          'categories',
          newCategory.uid,
          newCategory
        );
      }
    }

    const products =
      await FirestoreModule<ProductType>().getCollection('products');

    for (const product of products) {
      const categoryUidsIndexesToRemove: number[] = [];

      product.categoryUids.forEach((categoryUid, index) => {
        if (categoryUid === request.uid) {
          categoryUidsIndexesToRemove.push(index);
        }
      });

      const newCategoryUids = product.categoryUids;

      categoryUidsIndexesToRemove.sort((a, b) => b - a);

      for (const categoryUidsIndexToRemove of categoryUidsIndexesToRemove) {
        if (
          categoryUidsIndexToRemove >= 0 &&
          categoryUidsIndexToRemove < newCategoryUids.length
        ) {
          newCategoryUids.splice(categoryUidsIndexToRemove, 1);
        }
      }

      await FirestoreModule<ProductType>().writeDoc('products', product.uid, {
        ...product,
        categoryUids: newCategoryUids,
      });
    }

    const response: ResponseType<CategoryDeleteResponseType> = {
      data: {},
    };

    res.send(response);
    return;
  }
);

AdminRoutes.all('/currencies/sync', async (req, res) => {
  await FirestoreModule<CurrencyType>().deleteCollectionDocs('currencies');
  await FirestoreModule<CurrencyRatesType>().deleteCollectionDocs(
    'currencyRates'
  );

  const currencies = await ExchangeService().getCurrencies();
  const supportedCurrencies = Config.supportedCurrencies;

  for (const supportedCurrency of supportedCurrencies) {
    const supportedCurrencyData = currencies.find(
      (currency) => currency.code == supportedCurrency
    );

    if (!supportedCurrencyData) {
      continue;
    }

    await FirestoreModule<CurrencyType>().writeDoc(
      'currencies',
      supportedCurrency,
      supportedCurrencyData
    );

    const currencyRates =
      await ExchangeService().getCurrencyRates(supportedCurrency);

    await FirestoreModule<CurrencyRatesType>().writeDoc(
      'currencyRates',
      supportedCurrency,
      currencyRates
    );
  }

  const response: ResponseType<CurrenciesSyncResponseType> = {
    data: {},
  };

  res.send(response);
  return;
});

AdminRoutes.all('/product/fixture', async (req, res) => {
  const category = FixtureModule().generateCategory(null);

  await FirestoreModule<CategoryType>().writeDoc(
    'categories',
    category.uid,
    category
  );

  const product = FixtureModule().generateProduct([category.uid]);

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

AdminRoutes.all('/config/read', async (req, res) => {
  const config: PublicConfigType = {
    defaultCurrency: Config.defaultCurrency,
    supportedCurrencies: Config.supportedCurrencies,
    authenticationMethods: Config.authenticationMethods,
    attributesToFilter: Config.attributesToFilter,
    headerHeight: Config.headerHeight,
    hasInvitations: Config.hasInvitations,
    hasRequiredInvitation: Config.hasRequiredInvitation,
  };

  const response: ResponseType<PublicConfigReadResponseType> = {
    data: {
      config,
    },
  };

  res.send(response);
  return;
});

export default AdminRoutes;
