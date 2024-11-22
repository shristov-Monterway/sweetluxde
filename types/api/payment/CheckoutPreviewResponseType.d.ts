export interface CheckoutPreviewResponseLineItemType {
    uid: string;
    variation: string;
    quantity: number;
    price: number;
}

export interface CheckoutPreviewResponseType {
    lineItems: CheckoutPreviewResponseLineItemType[];
    currency: string;
    totalPrice: number;
}