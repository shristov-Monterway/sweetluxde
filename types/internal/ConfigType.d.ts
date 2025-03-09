export type ConfigAuthenticationMethodsType = "google" | "email" | "phone";

export interface ConfigType {
  defaultCurrency: string;
  supportedCurrencies: string[];
  stripeSecretKey: string;
  stripeWebhookSecretKey: string;
  authenticationMethods: ConfigAuthenticationMethodsType[];
  attributesToFilter: string[];
  headerHeight: number;
  hasInvitations: boolean;
  hasRequiredInvitation: boolean;
  mailerHost: string;
  mailerPort: number;
  mailerUseSsl: boolean;
  mailerUsername: string;
  mailerPassword: string;
  mailerFromName: string;
  mailerFromEmail: string;
}
