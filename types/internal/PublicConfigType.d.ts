import { ConfigType } from "./ConfigType";

export type PublicConfigType = Omit<ConfigType, 'stripeSecretKey' | 'stripeWebhookSecretKey'>