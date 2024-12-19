import { ProductType } from "../../internal/ProductType";

export interface ProductCreateUpdateRequestType {
    product: ProductType | Omit<ProductType, "uid">;
}