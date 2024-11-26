export interface CartType {
    lineItems: {
        product: string;
        variation: string;
        quantity: number;
    }[];
}