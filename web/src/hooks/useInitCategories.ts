import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { CategoriesAllRequestType } from '../../../types/api/product/CategoriesAllRequestType';
import { CategoryType } from '../../../types/internal/CategoryType';
import { CategoriesAllResponseType } from '../../../types/api/product/CategoriesAllResponseType';

export interface UseInitCategoriesProps {
  locale: string;
  currency: string;
}

const useInitCategories = (props: UseInitCategoriesProps): CategoryType[] => {
  const [categories, setCategories] = React.useState<CategoryType[]>([]);

  React.useEffect(() => {
    const syncCategories = async () => {
      const response = await FirebaseFunctionsModule<
        CategoriesAllRequestType,
        CategoriesAllResponseType
      >().call('/product/categories/all', {}, props.locale, props.currency);
      setCategories(response.categories);
    };

    syncCategories();
  }, [props.currency, props.locale]);

  return categories;
};

export default useInitCategories;
