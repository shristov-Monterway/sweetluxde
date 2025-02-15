import { ProductVariationType } from "./ProductVariationType";
import { TranslationType } from "./TranslationType";

export type ProductBadgeTypeType = 'success' | 'danger' | 'info' | 'warning';

export interface ProductBadgeType {
    type: ProductBadgeTypeType;
    text: TranslationType;
}

export interface ProductType {
    uid: string;
    name: TranslationType;
    description: TranslationType;
    variations: {
        [uid: string]: ProductVariationType;
    };
    tags: TranslationType[];
    badge: ProductBadgeType | null;
    categoryUids: string[];
}