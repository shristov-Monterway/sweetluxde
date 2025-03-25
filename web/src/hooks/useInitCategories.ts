import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { CategoriesAllRequestType } from '../../../types/api/product/CategoriesAllRequestType';
import { CategoryType } from '../../../types/internal/CategoryType';
import { CategoriesAllResponseType } from '../../../types/api/product/CategoriesAllResponseType';
import { CategoriesContextType } from '../contexts/AppContext';

export interface UseInitCategoriesProps {
  locale: string;
  currency: string;
}

const useInitCategories = (
  props: UseInitCategoriesProps
): CategoriesContextType => {
  const [categories, setCategories] = React.useState<CategoryType[]>([]);

  const syncCategories = async () => {
    const response = await FirebaseFunctionsModule<
      CategoriesAllRequestType,
      CategoriesAllResponseType
    >().call('/product/categories/all', {}, props.locale, props.currency);
    setCategories(response.categories);
  };

  React.useEffect(() => {
    syncCategories();
  }, [props.currency, props.locale]);

  const refresh = async () => {
    await syncCategories();
  };

  return {
    get: categories,
    set: setCategories,
    refresh,
  };
};

export default useInitCategories;
