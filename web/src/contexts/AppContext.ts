import React from 'react';
import { I18n } from 'i18n-js';
import { UserType } from '../../../types/internal/UserType';
import { FormError } from '../types/FormError';
import { ProductType } from '../../../types/internal/ProductType';

export interface ThemeContextType {
  get: string;
  set: (newTheme: string | ((theme: string) => string)) => void;
}

export interface CurrencyContextType {
  get: string;
  set: (newCurrency: string | ((currency: string) => string)) => void;
}

export interface FormErrorsContextType {
  get: FormError[];
  set: (
    newFormErrors: FormError[] | ((formErrors: FormError[]) => FormError[])
  ) => void;
}

export interface AppContextType {
  translator: I18n;
  theme: ThemeContextType;
  user: UserType | null;
  currency: CurrencyContextType;
  formErrors: FormErrorsContextType;
  products: ProductType[];
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export default AppContext;
