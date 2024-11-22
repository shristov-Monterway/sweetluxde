export interface CheckoutNewRequestType {
    lineItems: {
        uid: string;
        variation: string;
        quantity: number;
    }[];
    successUrl: string;
}