import FirestoreModule from './FirestoreModule';
import { CurrencyRatesType } from '../../../../types/internal/CurrencyRatesType';

export interface ExchangeModuleType {
  exchange: (from: string, to: string) => Promise<number>;
}

const ExchangeModule = (): ExchangeModuleType => {
  return {
    exchange: async (from, to) => {
      const currencyRates = await FirestoreModule<CurrencyRatesType>().getDoc(
        'currencyRates',
        from
      );

      if (!currencyRates) {
        throw new Error('Currency from is not supported!');
      }

      if (!currencyRates.rates[to]) {
        throw new Error('Currency to is not supported!');
      }

      return currencyRates.rates[to];
    },
  };
};

export default ExchangeModule;
