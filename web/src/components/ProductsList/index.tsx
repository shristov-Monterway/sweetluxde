import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import ProductCard from '../ProductCard';
import FiltersModalToggle from '../FiltersModalToggle';
import { ProductType } from '../../../../types/internal/ProductType';

export interface ProductsListProps extends AbstractComponentType {
  showFilters: boolean;
}

const ProductsList = (props: ProductsListProps): React.JSX.Element => {
  const app = useApp();

  const getCategoryDescendants = (
    categoryUid: string,
    result: string[] = []
  ): string[] => {
    if (!result.includes(categoryUid)) {
      result.push(categoryUid);

      const children = app.categories
        .filter((cat) => cat.parentUid === categoryUid)
        .map((cat) => cat.uid);

      children.forEach((uid) => {
        if (!result.includes(uid)) {
          getCategoryDescendants(uid, result);
        }
      });
    }
    return result;
  };

  const filterByPriceRange = (product: ProductType) => {
    return Object.values(product.variations).some((variation) => {
      const price = variation.price;
      return (
        price >= app.filters.get.price.min && price <= app.filters.get.price.max
      );
    });
  };

  const getFilteredProducts = () => {
    let filteredProducts = app.products;

    if (app.filters.get.categories.length > 0) {
      const allowedCategories: string[] = [];
      const uniqueCategories: { [key: string]: boolean } = {};

      app.filters.get.categories.forEach((categoryUid) => {
        const descendants = getCategoryDescendants(categoryUid);
        descendants.forEach((uid) => {
          if (!uniqueCategories[uid]) {
            uniqueCategories[uid] = true;
            allowedCategories.push(uid);
          }
        });
      });

      filteredProducts = filteredProducts.filter((product) =>
        product.categoryUids.some((uid) => allowedCategories.includes(uid))
      );
    }

    filteredProducts = filteredProducts.filter(filterByPriceRange);

    return filteredProducts;
  };

  return (
    <div className={`products-list ${props.className ? props.className : ''}`}>
      {props.showFilters ? <FiltersModalToggle /> : null}
      <div className="row">
        {getFilteredProducts().map((product, index) => (
          <div key={index} className="col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
