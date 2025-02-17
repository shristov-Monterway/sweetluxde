import React from 'react';
import { FiltersContextType } from '../contexts/AppContext';
import { useRouter } from 'next/router';
import { FilterType } from '../../../types/internal/FilterType';
import { ProductType } from '../../../types/internal/ProductType';

export interface UseInitFiltersProps {
  products: ProductType[];
}

const useInitFilters = (props: UseInitFiltersProps): FiltersContextType => {
  const defaultFilter: FilterType = {
    categories: [],
    price: {
      min: 0,
      max: 100000000000000000000000000,
      minRange: 0,
      maxRange: 0,
    },
    sort: 'publishedDate-desc',
  };
  const router = useRouter();
  const [filters, setFilters] = React.useState<FilterType>(defaultFilter);

  React.useEffect(() => {
    if (router.isReady) {
      const initialFilters = router.query.filters;
      try {
        const parsed: FilterType =
          typeof initialFilters === 'string'
            ? JSON.parse(initialFilters)
            : defaultFilter;

        setFilters(parsed);
      } catch (e) {
        console.error('Failed to parse filters:', e);
      }
    }
  }, [router.isReady]);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const filtersQuery: FilterType =
      router.query.filters && typeof router.query.filters === 'string'
        ? JSON.parse(router.query.filters)
        : defaultFilter;

    if (JSON.stringify(filtersQuery) !== JSON.stringify(filters)) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            filters: JSON.stringify(filters),
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    }
  }, [filters, router.isReady]);

  React.useEffect(() => {
    let minPriceOfProducts: number = 0;
    let maxPriceOfProducts: number = 0;

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
        ...filters.price,
        minRange: minPriceOfProducts,
        maxRange: maxPriceOfProducts,
      },
    }));
  }, [props.products]);

  const reset = (): void => {
    let minPriceOfProducts: number = 0;
    let maxPriceOfProducts: number = 0;

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

    setFilters({
      ...defaultFilter,
      price: {
        min: minPriceOfProducts,
        max: maxPriceOfProducts,
        minRange: minPriceOfProducts,
        maxRange: maxPriceOfProducts,
      },
    });
  };

  return {
    get: filters,
    set: setFilters,
    reset,
  };
};

export default useInitFilters;
