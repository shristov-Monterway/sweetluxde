import { TranslationType } from "./TranslationType";

export interface CategoryType {
  uid: string;
  name: TranslationType;
  description: TranslationType;
  parentUid: string | null;
}
