import * as express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { CartUpdateRequestType } from '../../../../types/api/cart/CartUpdateRequestType';
import { UserType } from '../../../../types/internal/UserType';
import FirestoreModule from '../modules/FirestoreModule';
import { ResponseType } from '../../../../types/api/ResponseType';
import { CartUpdateResponseType } from '../../../../types/api/cart/CartUpdateResponseType';

const CartRoutes = express.Router();

CartRoutes.all(
  '/cart/update',
  checkSchema({
    product: {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    variation: {
      in: 'body',
      notEmpty: true,
      isString: true,
    },
    quantity: {
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

    const user = req.user as UserType | null;

    if (!user) {
      res.status(401).send();
      return;
    }

    const request: CartUpdateRequestType = req.body;

    const lineItems = user.cart.lineItems;
    const indexOfLineItemToHandle = lineItems
      .map(
        (lineItem) =>
          `${lineItem.product}_${lineItem.variation}_${Object.keys(
            lineItem.attributes
          )
            .map(
              (attributeId) =>
                `${attributeId}_${lineItem.attributes[attributeId]}`
            )
            .join('_')}`
      )
      .indexOf(
        `${request.product}_${request.variation}_${Object.keys(
          request.attributes
        )
          .map(
            (attributeId) => `${attributeId}_${request.attributes[attributeId]}`
          )
          .join('_')}`
      );

    if (indexOfLineItemToHandle === -1) {
      lineItems.push({
        product: request.product,
        variation: request.variation,
        attributes: request.attributes,
        quantity: 1,
      });
    } else {
      const newQuantity =
        lineItems[indexOfLineItemToHandle].quantity + request.quantity;
      if (newQuantity <= 0) {
        lineItems.splice(indexOfLineItemToHandle, 1);
      } else {
        lineItems[indexOfLineItemToHandle] = {
          ...lineItems[indexOfLineItemToHandle],
          quantity: newQuantity,
        };
      }
    }

    user.cart.lineItems = lineItems;

    await FirestoreModule<UserType>().writeDoc('users', user.uid, user);

    const response: ResponseType<CartUpdateResponseType> = {
      data: {
        cart: user.cart,
      },
    };

    res.send(response);
    return;
  }
);

export default CartRoutes;
