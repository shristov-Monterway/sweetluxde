import React from 'react';
import { ProductType } from '../../../../types/internal/ProductType';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface ProductFormProps extends AbstractComponentType {
  product?: ProductType;
}

const ProductForm = (props: ProductFormProps): React.JSX.Element => {
  const [newProduct, setNewProduct] = React.useState<Omit<ProductType, 'uid'>>({

  });

  const onSubmit = (): void => {};

  return (
    <form
      className={`product-form ${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    ></form>
  );
};

export default ProductForm;
