import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import ProductCard from '../ProductCard';
import { ProductType } from '../../../../types/internal/ProductType';
import SortFilterForm from '../SortFilterForm';
import FiltersResetButton from '../FiltersResetButton';
import { FilterType } from '../../../../types/internal/FilterType';
import FiltersModal from '../FiltersModal';

export interface ProductsListProps extends AbstractComponentType {
  products: ProductType[];
  showFilters: boolean;
  showSorting: boolean;
  filters?: Partial<FilterType>;
  showCategoryFilter?: boolean;
  showPriceFilter?: boolean;
  showAttributesFilter?: boolean;
}

const ProductsList = (props: ProductsListProps): React.JSX.Element => {
  const app = useApp();
  const defaultFilters: FilterType = {
    categories: [],
    price: {
      min: 0,
      max: 100000000000000000000000000,
      minRange: 0,
      maxRange: 100000000000000000000000000,
    },
    attributes: app.config.attributesToFilter.reduce(
      (attributesFilter, attributeId) => ({
        ...attributesFilter,
        [attributeId]: [],
      }),
      {}
    ),
    sort: 'publishedDate-desc',
  };
  const [filters, setFilters] = React.useState<FilterType>(defaultFilters);
  const [showFiltersModal, setShowFiltersModal] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    let minPriceOfProducts: number = 0;
    let maxPriceOfProducts: number = 100000000000000000000000000;

    props.products.forEach((product, productIndex) => {
      Object.keys(product.variations).forEach(
        (variationUid, variationIndex) => {
          if (productIndex === 0 && variationIndex === 0) {
            minPriceOfProducts = product.variations[variationUid].price;
            maxPriceOfProducts = product.variations[variationUid].price;
          } else {
            if (product.variations[variationUid].price > maxPriceOfProducts) {
              maxPriceOfProducts = product.variations[variationUid].price;
            }
            if (product.variations[variationUid].price < minPriceOfProducts) {
              minPriceOfProducts = product.variations[variationUid].price;
            }
          }
        }
      );
    });

    setFilters((filters) => ({
      ...filters,
      price: {
        min: minPriceOfProducts,
        max: maxPriceOfProducts,
        minRange: minPriceOfProducts,
        maxRange: maxPriceOfProducts,
      },
      attributes: app.config.attributesToFilter.reduce(
        (attributesFilter, attributeId) => ({
          ...attributesFilter,
          [attributeId]: filters.attributes[attributeId]
            ? filters.attributes[attributeId]
            : [],
        }),
        {}
      ),
      ...(props.filters ? props.filters : {}),
    }));
  }, [props.products, props.filters]);

  const resetFilters = () => {
    let minPriceOfProducts: number = 0;
    let maxPriceOfProducts: number = 100000000000000000000000000;

    props.products.forEach((product, productIndex) => {
      Object.keys(product.variations).forEach(
        (variationUid, variationIndex) => {
          if (productIndex === 0 && variationIndex === 0) {
            minPriceOfProducts = product.variations[variationUid].price;
            maxPriceOfProducts = product.variations[variationUid].price;
          } else {
            if (product.variations[variationUid].price > maxPriceOfProducts) {
              maxPriceOfProducts = product.variations[variationUid].price;
            }
            if (product.variations[variationUid].price < minPriceOfProducts) {
              minPriceOfProducts = product.variations[variationUid].price;
            }
          }
        }
      );
    });

    setFilters((filters) => ({
      categories: [],
      price: {
        min: minPriceOfProducts,
        max: maxPriceOfProducts,
        minRange: minPriceOfProducts,
        maxRange: maxPriceOfProducts,
      },
      attributes: app.config.attributesToFilter.reduce(
        (attributesFilter, attributeId) => ({
          ...attributesFilter,
          [attributeId]: [],
        }),
        {}
      ),
      sort: filters.sort,
      ...(props.filters ? props.filters : {}),
    }));
  };

  const getCategoryDescendants = (
    categoryUid: string,
    result: string[] = []
  ): string[] => {
    if (!result.includes(categoryUid)) {
      result.push(categoryUid);

      const children = app.categories.get
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
      return price >= filters.price.min && price <= filters.price.max;
    });
  };

  const filterByAttributes = (product: ProductType) => {
    const attributesFilter = filters.attributes;
    if (Object.keys(attributesFilter).length === 0) return true;

    return Object.values(product.variations).some((variation) => {
      return Object.entries(attributesFilter).every(
        ([attributeId, selectedOptions]) => {
          if (selectedOptions.length === 0) return true;

          const variationOptions =
            variation.attributes[attributeId]?.options || {};

          return selectedOptions.some((optionId) =>
            Object.keys(variationOptions).includes(optionId)
          );
        }
      );
    });
  };

  const sortProducts = (products: ProductType[]) => {
    const sortBy = filters.sort;

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
    let filteredProducts = props.products;

    if (filters.categories && filters.categories.length > 0) {
      const allowedCategories: string[] = [];
      const uniqueCategories: { [key: string]: boolean } = {};

      filters.categories.forEach((categoryUid) => {
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

  const products = getFilteredProducts();

  return (
    <div className={`products-list ${props.className ? props.className : ''}`}>
      <FiltersModal
        showModal={showFiltersModal}
        setShowModal={setShowFiltersModal}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        showCategoryFilter={props.showCategoryFilter}
        showPriceFilter={props.showPriceFilter}
        showAttributesFilter={props.showAttributesFilter}
      />
      <div className="products-list__actions">
        <span className="products-list__count">
          {app.translator.t('components.productsList.foundProductsCount', {
            count: products.length,
          })}
        </span>
        {props.showFilters || props.showSorting ? (
          <div className="products-list__filters">
            {props.showFilters ? (
              <FiltersResetButton
                resetFilters={resetFilters}
                className="products-list__sorting-filter btn btn-outline-danger"
              />
            ) : null}
            {props.showSorting ? (
              <SortFilterForm
                filters={filters}
                setFilters={setFilters}
                className="products-list__sorting-filter"
              />
            ) : null}
            {props.showFilters ? (
              <button
                className="products-list__sorting-filter btn btn-primary"
                onClick={() =>
                  setShowFiltersModal((showFiltersModal) => !showFiltersModal)
                }
              >
                <i className="fe fe-filter" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="row">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="col-lg-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="products-list__empty-container">
            <hr className="flex-grow-1" />
            <span className="products-list__empty-label">
              {app.translator.t('components.productsList.foundProductsCount', {
                count: 0,
              })}
            </span>
            <hr className="flex-grow-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
