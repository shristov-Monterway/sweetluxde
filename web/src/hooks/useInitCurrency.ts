import React from 'react';
import { CurrencyContextType } from '../contexts/AppContext';

const useInitCurrency = (): CurrencyContextType => {
  const [currency, setCurrency] = React.useState<string>('USD');

  return {
    get: currency,
    set: setCurrency,
  };
};

export default useInitCurrency;
