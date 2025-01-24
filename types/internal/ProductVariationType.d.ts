import { TranslationType } from "./TranslationType";

export interface ProductVariationType {
    name: TranslationType;
    description: TranslationType;
    price: number;
    weight: number | null;
    images: string[];
    attributes: {
        [uid: string]: {
            name: TranslationType;
            options: {
                [uid: string]: {
                    name: TranslationType;
                };
            };
        };
    };
}