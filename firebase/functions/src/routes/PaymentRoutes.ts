import * as express from 'express';
import FirestoreModule from '../modules/FirestoreModule';
import { CurrencyType } from '../../../../types/internal/CurrencyType';
import { ResponseType } from '../../../../types/api/ResponseType';
import { CurrenciesAllResponseType } from '../../../../types/api/payment/CurrenciesAllResponseType';
import { checkSchema, validationResult } from 'express-validator';
import { CheckoutPreviewRequestType } from '../../../../types/api/payment/CheckoutPreviewRequestType';
import ExchangeModule from '../modules/ExchangModule';
import Config from '../Config';
import {
  CheckoutPreviewResponseLineItemType,
  CheckoutPreviewResponseType,
} from '../../../../types/api/payment/CheckoutPreviewResponseType';
import { ProductType } from '../../../../types/internal/ProductType';
import { CheckoutNewRequestType } from '../../../../types/api/payment/CheckoutNewRequestType';
import {
  CheckoutLineItemType,
  CheckoutType,
} from '../../../../types/internal/CheckoutType';
import { CheckoutNewResponseType } from '../../../../types/api/payment/CheckoutNewResponseType';
import { UserType } from '../../../../types/internal/UserType';
import StripeService from '../services/StripeService';

const PaymentRoutes = express.Router();

PaymentRoutes.all('/currencies/all', async (req, res) => {
  const currencies =
    await FirestoreModule<CurrencyType>().getCollection('currencies');

  const response: ResponseType<CurrenciesAllResponseType> = {
    data: {
      currencies,
    },
  };

  res.send(response);
  return;
});

PaymentRoutes.all(
  '/checkout/preview',
  checkSchema({
    'lineItems.*.product': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.variation': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.quantity': {
      in: 'body',
      isInt: true,
      toInt: true,
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

    const request: CheckoutPreviewRequestType = req.body;

    const rate = await ExchangeModule().exchange(
      Config.defaultCurrency,
      req.currency
    );

    const lineItems: CheckoutPreviewResponseLineItemType[] = [];

    for (const lineItem of request.lineItems) {
      const product = await FirestoreModule<ProductType>().getDoc(
        'products',
        lineItem.product
      );

      if (!product) {
        continue;
      }

      const variation = product.variations[lineItem.variation];

      if (!variation) {
        continue;
      }

      const price = Math.ceil(rate * variation.price);

      lineItems.push({
        product: lineItem.product,
        variation: lineItem.variation,
        quantity: lineItem.quantity,
        price,
      });
    }

    const totalPrice = lineItems
      .map((lineItem) => lineItem.price * lineItem.quantity)
      .reduce((previous, price) => previous + price, 0);

    const response: ResponseType<CheckoutPreviewResponseType> = {
      data: {
        lineItems,
        currency: req.currency,
        totalPrice,
      },
    };

    res.send(response);
    return;
  }
);

PaymentRoutes.all(
  '/checkout/new',
  checkSchema({
    'lineItems.*.product': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.variation': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.quantity': {
      in: 'body',
      isInt: true,
      toInt: true,
    },
    successUrl: {
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

    if (!user) {
      res.status(401).send();
      return;
    }

    const request: CheckoutNewRequestType = req.body;

    const rate = await ExchangeModule().exchange(
      Config.defaultCurrency,
      req.currency
    );

    const lineItems: CheckoutLineItemType[] = [];

    for (const lineItem of request.lineItems) {
      const product = await FirestoreModule<ProductType>().getDoc(
        'products',
        lineItem.product
      );

      if (!product) {
        continue;
      }

      const variation = product.variations[lineItem.variation];

      if (!variation) {
        continue;
      }

      const price = Math.ceil(rate * variation.price);

      lineItems.push({
        product: {
          name: product.name[req.locale]
            ? product.name[req.locale]
            : product.name[Object.keys(product.name)[0]],
          description: product.description[req.locale]
            ? product.description[req.locale]
            : product.description[Object.keys(product.description)[0]],
          price,
          currency: req.currency,
        },
        quantity: lineItem.quantity,
      });
    }

    const newCheckout: Omit<CheckoutType, 'uid' | 'status' | 'url'> = {
      userUid: user.uid,
      userEmail: user.email,
      lineItems,
      currency: req.currency,
      locale: req.locale,
      successUrl: request.successUrl,
      address: request.address,
    };

    const checkout = await StripeService().createCheckoutSession(newCheckout);

    await FirestoreModule<CheckoutType>().writeDoc(
      'checkouts',
      checkout.uid,
      checkout
    );

    const response: ResponseType<CheckoutNewResponseType> = {
      data: {
        url: checkout.url,
      },
    };

    res.send(response);
    return;
  }
);

PaymentRoutes.all(
  '/stripe/webhook',
  checkSchema({
    'stripe-signature': {
      in: 'headers',
      notEmpty: true,
      isString: true,
    },
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;

    const event = StripeService().getEvent(req.rawBody, signature);

    if (event.type === 'checkout.session.completed') {
      const checkout = await FirestoreModule<CheckoutType>().getDoc(
        'checkouts',
        event.data.object.id
      );

      if (!checkout) {
        throw new Error('Checkout does not exist!');
      }

      await FirestoreModule<CheckoutType>().writeDoc(
        'checkouts',
        checkout.uid,
        {
          ...checkout,
          status: 'done',
        }
      );
    }

    res.status(200).send();
    return;
  }
);

export default PaymentRoutes;
