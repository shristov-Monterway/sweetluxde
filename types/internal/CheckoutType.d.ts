export interface CheckoutLineItemType {
    product: {
        name: string;
        description: string;
        price: number;
        currency: string;
    };
    quantity: number;
}

export interface CheckoutType {
    uid: string;
    userUid: string;
    userEmail: string;
    lineItems: CheckoutLineItemType[];
    currency: string;
    locale: string;
    successUrl: string;
    status: 'waiting' | 'done';
    url: string;
}