export interface CheckoutPreviewResponseLineItemType {
    product: string;
    variation: string;
    quantity: number;
    price: number;
}

export interface CheckoutPreviewResponseType {
    lineItems: CheckoutPreviewResponseLineItemType[];
    currency: string;
    totalPrice: number;
}