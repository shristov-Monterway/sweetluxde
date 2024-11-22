export interface CheckoutPreviewRequestType {
    lineItems: {
        uid: string;
        variation: string;
        quantity: number;
    }[];
}