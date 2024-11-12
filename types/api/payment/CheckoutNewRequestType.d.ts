export interface CheckoutNewRequestType {
    lineItems: {
        uid: string;
        quantity: number;
    }[];
    currency: string;
    successUrl: string;
}