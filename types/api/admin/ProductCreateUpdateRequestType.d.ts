import { ProductType } from "../../internal/ProductType";

export interface ProductCreateUpdateRequestType {
    product: Omit<ProductType, "uid">;
    uid?: string;
}