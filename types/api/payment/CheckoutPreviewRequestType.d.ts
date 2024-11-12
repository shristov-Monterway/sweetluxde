export interface CheckoutPreviewRequestType {
    lineItems: {
        uid: string;
        quantity: number;
    }[];
    currency: string;
}