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
    'lineItems.*.uid': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.quantity': {
      in: 'body',
      isInt: true,
      toInt: true,
    },
    currency: {
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

    const request: CheckoutPreviewRequestType = req.body;

    const rate = await ExchangeModule().exchange(
      Config.defaultCurrency,
      request.currency
    );

    const lineItems: CheckoutPreviewResponseLineItemType[] = [];

    for (const lineItem of request.lineItems) {
      const product = await FirestoreModule<ProductType>().getDoc(
        'products',
        lineItem.uid
      );

      if (!product) {
        continue;
      }

      const price = Math.ceil(rate * product.price);

      lineItems.push({
        uid: lineItem.uid,
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
        currency: request.currency,
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
    'lineItems.*.uid': {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    'lineItems.*.quantity': {
      in: 'body',
      isInt: true,
      toInt: true,
    },
    currency: {
      in: 'body',
      notEmpty: true,
      isString: true,
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

    const user = req.user;

    if (!user) {
      res.status(401).send();
      return;
    }

    const request: CheckoutNewRequestType = req.body;

    const rate = await ExchangeModule().exchange(
      Config.defaultCurrency,
      request.currency
    );

    const lineItems: CheckoutLineItemType[] = [];

    for (const lineItem of request.lineItems) {
      const product = await FirestoreModule<ProductType>().getDoc(
        'products',
        lineItem.uid
      );

      if (!product) {
        continue;
      }

      const price = Math.ceil(rate * product.price);

      lineItems.push({
        price_data: {
          currency: request.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          tax_behavior: product.taxBehavior,
          unit_amount: price,
        },
        quantity: lineItem.quantity,
      });
    }

    const checkoutsRef = FirestoreModule<CheckoutType>().getCollectionRef(
      `users/${req.user.uid}/checkout_sessions`
    );

    const checkoutRef = await checkoutsRef.add({
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.FUNCTIONS_EMULATOR
        ? `http://127.0.0.1:5001/era-bets/europe-west3/app/payment/checkout-session/complete?sessionId={CHECKOUT_SESSION_ID}&userId=${user.uid}`
        : `https://europe-west3-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/app/payment/checkout-session/complete?sessionId={CHECKOUT_SESSION_ID}&userId=${user.uid}`,
      currency: request.currency,
      locale: req.locale,
      payment_method_types: ['card'],
    });

    setTimeout(async () => {
      const checkout = (await checkoutRef.get()).data();

      if (!checkout) {
        throw new Error("Checkout session couldn't be created!");
      }

      if (checkout.error) {
        res.status(500).send(checkout.error.message);
        return;
      }

      await checkoutRef.set({
        ...checkout,
        success_url: request.successUrl,
      });

      if (!checkout.url) {
        throw new Error("Checkout session URL couldn't be created!");
      }

      const response: ResponseType<CheckoutNewResponseType> = {
        data: {
          url: checkout.url,
        },
      };

      res.send(response);
      return;
    }, 5000);
  }
);

export default PaymentRoutes;
