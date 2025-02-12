import { TranslationType } from "./TranslationType";

export interface CategoryType {
    uid: string;
    name: TranslationType;
    parentUid: string | null;
}