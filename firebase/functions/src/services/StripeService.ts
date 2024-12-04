import Stripe from 'stripe';
import config from '../Config';
import { CheckoutType } from '../../../../types/internal/CheckoutType';

export interface StripeServiceType {
  createCheckoutSession: (
    checkout: Omit<CheckoutType, 'uid' | 'status' | 'url'>
  ) => Promise<CheckoutType>;
  getEvent: (body: string, signature: string) => Stripe.Event;
}

const StripeService = (): StripeServiceType => {
  const stripe = new Stripe(config.stripeSecretKey);

  return {
    createCheckoutSession: async (checkout) => {
      const stripeCheckoutSession: Stripe.Checkout.SessionCreateParams = {
        customer_email: checkout.userEmail,
        line_items: checkout.lineItems.map((lineItem) => ({
          price_data: {
            currency: lineItem.product.currency,
            product_data: {
              name: lineItem.product.name,
              description: lineItem.product.description,
            },
            tax_behavior: 'inclusive',
            unit_amount: lineItem.product.price,
          },
          quantity: lineItem.quantity,
        })),
        mode: 'payment',
        success_url: checkout.successUrl,
      };

      const checkoutSession = await stripe.checkout.sessions.create(
        stripeCheckoutSession
      );

      const uid = checkoutSession.id;
      const url = checkoutSession.url;

      if (!url) {
        throw new Error('URL for checkout was not created!');
      }

      return {
        ...checkout,
        uid,
        url,
        status: 'waiting',
      };
    },
    getEvent: (body: string, signature: string) => {
      return stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripeWebhookSecretKey
      );
    },
  };
};

export default StripeService;
