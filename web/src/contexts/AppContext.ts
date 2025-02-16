import React from 'react';
import { I18n } from 'i18n-js';
import { UserType } from '../../../types/internal/UserType';
import { FormErrorType } from '../types/FormErrorType';
import { PublicConfigType } from '../../../types/internal/PublicConfigType';
import { CategoryType } from '../../../types/internal/CategoryType';
import { ProductType } from '../../../types/internal/ProductType';
import { FilterType } from '../../../types/internal/FilterType';

export interface ThemeContextType {
  get: string;
  set: (newTheme: string | ((theme: string) => string)) => void;
}

export interface CurrencyContextType {
  get: string;
  set: (newCurrency: string | ((currency: string) => string)) => void;
}

export interface FormErrorsContextType {
  get: FormErrorType[];
  set: (
    newFormErrors:
      | FormErrorType[]
      | ((formErrors: FormErrorType[]) => FormErrorType[])
  ) => void;
}

export interface ActiveModalContextType {
  get: 'authModal' | 'localeModal' | 'filtersModal' | null;
  set: (
    newActiveModal: 'authModal' | 'localeModal' | 'filtersModal' | null
  ) => void;
}

export interface FiltersContextType {
  get: FilterType;
  set: (newFilters: FilterType | ((filters: FilterType) => FilterType)) => void;
  reset: () => void;
}

export interface AppContextType {
  translator: I18n;
  theme: ThemeContextType;
  user: UserType | null;
  currency: CurrencyContextType;
  formErrors: FormErrorsContextType;
  products: ProductType[];
  categories: CategoryType[];
  activeModal: ActiveModalContextType;
  config: PublicConfigType;
  filters: FiltersContextType;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export default AppContext;
