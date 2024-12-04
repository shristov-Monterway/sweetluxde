export interface ConfigType {
    defaultCurrency: string;
    supportedCurrencies: string[];
    stripeSecretKey: string;
    stripeWebhookSecretKey: string;
}