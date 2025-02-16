export interface FilterType {
    categories: string[];
    price: {
        min: number;
        max: number;
        minRange: number;
        maxRange: number;
    };
}