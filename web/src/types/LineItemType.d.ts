import { ProductType } from '../../../types/internal/ProductType';
import { ProductVariationType } from '../../../types/internal/ProductVariationType';

export interface LineItemType {
  product: ProductType;
  variation: ProductVariationType;
  quantity: number;
}
