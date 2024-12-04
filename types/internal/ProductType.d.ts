import { ProductVariationType } from "./ProductVariationType";
import { TranslationType } from "./TranslationType";

export interface ProductType {
    uid: string;
    name: TranslationType;
    description: TranslationType;
    variations: {
        [uid: string]: ProductVariationType;
    };
    image: string | null;
    tags: TranslationType[];
}