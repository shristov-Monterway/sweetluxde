export interface CheckoutLineItemType {
    price_data: {
        currency: string;
        product_data: {
            name: string;
            description: string;
        };
        tax_behavior: string;
        unit_amount: number;
    };
    quantity: number;
}

export interface CheckoutType {
    line_items: CheckoutLineItemType[];
    mode: 'payment';
    success_url: string;
    currency: string;
    locale: string;
    payment_method_types: string[];
    error?: {
        message: string;
    };
    url?: string;
    sessionId?: string;
}