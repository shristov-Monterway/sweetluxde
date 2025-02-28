export interface CheckoutNewRequestType {
  lineItems: {
    product: string;
    variation: string;
    quantity: number;
  }[];
  successUrl: string;
}
