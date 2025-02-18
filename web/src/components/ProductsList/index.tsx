import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import ProductCard from '../ProductCard';
import FiltersModalToggle from '../FiltersModalToggle';
import { ProductType } from '../../../../types/internal/ProductType';
import SortFilterForm from '../SortFilterForm';

export interface ProductsListProps extends AbstractComponentType {
  showFilters?: boolean;
  showSorting?: boolean;
}

const ProductsList = (props: ProductsListProps): React.JSX.Element => {
  const app = useApp();
  const showFilters = props.showFilters ? props.showFilters : true;
  const showSorting = props.showSorting ? props.showSorting : true;

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

  const filterByAttributes = (product: ProductType) => {
    const selectedAttributes = app.filters.get.attributes;

    if (Object.keys(selectedAttributes).length === 0) return true;

    return Object.values(product.variations).some((variation) => {
      return Object.entries(selectedAttributes).every(
        ([attributeId, selectedOptions]) => {
          const variationOptions =
            variation.attributes[attributeId]?.options || {};

          return selectedOptions.every((optionId) =>
            Object.keys(variationOptions).includes(optionId)
          );
        }
      );
    });
  };

  const sortProducts = (products: ProductType[]) => {
    const sortBy = app.filters.get.sort;

    if (sortBy === 'price-asc') {
      return [...products].sort((a, b) => {
        const minPriceA = Math.min(
          ...Object.values(a.variations).map((v) => v.price)
        );
        const minPriceB = Math.min(
          ...Object.values(b.variations).map((v) => v.price)
        );
        return minPriceA - minPriceB;
      });
    }

    if (sortBy === 'price-desc') {
      return [...products].sort((a, b) => {
        const minPriceA = Math.min(
          ...Object.values(a.variations).map((v) => v.price)
        );
        const minPriceB = Math.min(
          ...Object.values(b.variations).map((v) => v.price)
        );
        return minPriceB - minPriceA;
      });
    }

    if (sortBy === 'publishedDate-asc') {
      return [...products].sort((a, b) => {
        return (
          new Date(a.publishedDate).getTime() -
          new Date(b.publishedDate).getTime()
        );
      });
    }

    if (sortBy === 'publishedDate-desc') {
      return [...products].sort((a, b) => {
        return (
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
        );
      });
    }

    return products;
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

    filteredProducts = filteredProducts.filter(filterByAttributes);

    filteredProducts = sortProducts(filteredProducts);

    return filteredProducts;
  };

  return (
    <div className={`products-list ${props.className ? props.className : ''}`}>
      {showFilters || showSorting ? (
        <div className="products-list__filters">
          {showSorting ? (
            <SortFilterForm className="products-list__sorting-filter" />
          ) : null}
          {showFilters ? <FiltersModalToggle /> : null}
        </div>
      ) : null}
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
