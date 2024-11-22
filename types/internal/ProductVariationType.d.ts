import { TranslationType } from "./TranslationType";

export interface ProductVariationType {
    name: TranslationType;
    description: TranslationType;
    price: number;
    images: string[];
}