export interface CheckoutPreviewRequestType {
    lineItems: {
        product: string;
        variation: string;
        quantity: number;
    }[];
}