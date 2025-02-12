import { ProductType } from "../../internal/ProductType";
import { CategoryType } from "../../internal/CategoryType";

export interface ProductDataType extends ProductType {
    categoriesData: CategoryType[];
}

export interface ProductsAllResponseType {
    products: ProductDataType[];
}