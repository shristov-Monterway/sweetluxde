import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import ProductCard from '../ProductCard';
import FiltersModalToggle from '../FiltersModalToggle';

export interface ProductsListProps extends AbstractComponentType {
  showFilters: boolean;
}

const ProductsList = (props: ProductsListProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div className={`products-list ${props.className ? props.className : ''}`}>
      {props.showFilters ? <FiltersModalToggle /> : null}
      <div className="row">
        {app.products.map((product, index) => (
          <div key={index} className="col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
