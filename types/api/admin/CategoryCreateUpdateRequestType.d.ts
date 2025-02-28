import { CategoryType } from "../../internal/CategoryType";

export interface CategoryCreateUpdateRequestType {
  category: Omit<CategoryType, "uid">;
  uid?: string;
}
