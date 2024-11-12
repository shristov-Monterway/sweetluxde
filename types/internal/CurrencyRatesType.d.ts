export interface CurrencyRatesType {
    code: string;
    rates: {
        [currencyCode: string]: number;
    };
}