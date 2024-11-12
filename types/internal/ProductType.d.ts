export interface ProductType {
    name: string;
    description: string;
    taxBehavior: 'inclusive' | 'exclusive' | 'unspecified';
    price: number;
    currency: string;
}