export interface WishListType {
    lineItems: {
        product: string;
        variation: string;
        quantity: number;
    }[];
}