export type FilterSortValueType = 'price-asc' | 'price-desc' | 'publishedDate-asc' | 'publishedDate-desc';

export interface FilterType {
    categories: string[];
    price: {
        min: number;
        max: number;
        minRange: number;
        maxRange: number;
    };
    attributes: {
        [key: string]: string[];
    };
    sort: FilterSortValueType;
}