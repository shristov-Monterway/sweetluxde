export interface CartType {
    lineItems: {
        product: string;
        variation: string;
        attributes: {
            [uid: string]: string;
        };
        quantity: number;
    }[];
}