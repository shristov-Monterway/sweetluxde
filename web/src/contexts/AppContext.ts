import React from 'react';
import { I18n } from 'i18n-js';
import { UserType } from '../../../types/internal/UserType';
import { FormErrorType } from '../types/FormErrorType';
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
  get: FormErrorType[];
  set: (
    newFormErrors:
      | FormErrorType[]
      | ((formErrors: FormErrorType[]) => FormErrorType[])
  ) => void;
}

export interface ActiveModalContextType {
  get: 'authModal' | 'localeModal' | null;
  set: (newActiveModal: 'authModal' | 'localeModal' | null) => void;
}

export interface AppContextType {
  translator: I18n;
  theme: ThemeContextType;
  user: UserType | null;
  currency: CurrencyContextType;
  formErrors: FormErrorsContextType;
  products: ProductType[];
  activeModal: ActiveModalContextType;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export default AppContext;
