export interface CartUpdateRequestType {
    product: string;
    variation: string;
    attributes: {
        [uid: string]: string;
    };
    quantity: -1|1;
}