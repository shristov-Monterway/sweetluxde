import { ConfigType } from "./ConfigType";

export type PublicConfigType = Omit<
  ConfigType,
  | "stripeSecretKey"
  | "stripeWebhookSecretKey"
  | "mailerHost"
  | "mailerPort"
  | "mailerUseSsl"
  | "mailerUsername"
  | "mailerPassword"
  | "mailerFromName"
  | "mailerFromEmail"
>;
