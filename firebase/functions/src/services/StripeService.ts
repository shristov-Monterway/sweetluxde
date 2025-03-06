import Stripe from 'stripe';
import Config from '../Config';
import { CheckoutType } from '../../../../types/internal/CheckoutType';

export interface StripeServiceType {
  createCheckoutSession: (
    checkout: Omit<CheckoutType, 'uid' | 'status' | 'url'>
  ) => Promise<CheckoutType>;
  getEvent: (body: string, signature: string) => Stripe.Event;
}

const StripeService = (): StripeServiceType => {
  const stripe = new Stripe(Config.stripeSecretKey);

  return {
    createCheckoutSession: async (checkout) => {
      const stripeCheckoutSession: Stripe.Checkout.SessionCreateParams = {
        billing_address_collection: 'auto',
        customer_email: checkout.userEmail,
        line_items: checkout.lineItems.map((lineItem) => ({
          price_data: {
            currency: lineItem.currency,
            product_data: {
              name: lineItem.productName,
              description: `${lineItem.variationName}; ${Object.keys(
                lineItem.attributes
              )
                .map(
                  (attributeId) =>
                    `${lineItem.attributes[attributeId].name}: ${lineItem.attributes[attributeId].optionName}`
                )
                .join('; ')}`,
              images: lineItem.image ? [lineItem.image] : [],
            },
            tax_behavior: 'inclusive',
            unit_amount: lineItem.price,
          },
          quantity: lineItem.quantity,
        })),
        mode: 'payment',
        success_url: checkout.successUrl,
        locale: checkout.locale as Stripe.Checkout.SessionCreateParams.Locale,
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
        Config.stripeWebhookSecretKey
      );
    },
  };
};

export default StripeService;
