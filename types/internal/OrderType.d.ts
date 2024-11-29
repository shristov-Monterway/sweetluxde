export interface OrderLineItemType {
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

export interface OrderType {
    uid: string;
    lineItems: OrderLineItemType[];
}