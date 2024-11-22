import { CurrencyType } from '../../../../types/internal/CurrencyType';
import { CurrencyRatesType } from '../../../../types/internal/CurrencyRatesType';
import Config from '../Config';

export interface ExchangeService {
  getCurrencies: () => Promise<CurrencyType[]>;
  getCurrencyRates: (currencyCode: string) => Promise<CurrencyRatesType>;
}

const ExchangeService = (): ExchangeService => {
  return {
    getCurrencies: async () => {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
      );

      if (!response.ok) {
        throw new Error('Exchange API is not responding!');
      }

      const data = (await response.json()) as {
        [key: string]: string;
      };

      const currencies: CurrencyType[] = Object.keys(data)
        .filter((code) => {
          return data[code] !== '';
        })
        .map((code) => ({
          code: code.toUpperCase(),
          name: data[code],
        }));

      return currencies;
    },
    getCurrencyRates: async (currencyCode) => {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyCode.toLowerCase()}.json`
      );

      if (!response.ok) {
        throw new Error('Exchange API is not responding!');
      }

      const data = (await response.json()) as {
        [currencyCode: string]: {
          [currencyCode: string]: number;
        };
      };

      if (!data[currencyCode.toLowerCase()]) {
        throw new Error('Exchange API data is not valid!');
      }

      const currencies = Config.supportedCurrencies;

      const rates: {
        [currencyCode: string]: number;
      } = {};

      currencies.forEach((currency) => {
        if (data[currencyCode.toLowerCase()][currency.toLowerCase()]) {
          rates[currency.toUpperCase()] =
            data[currencyCode.toLowerCase()][currency.toLowerCase()];
        }
      });

      const currencyRate: CurrencyRatesType = {
        code: currencyCode,
        rates,
      };

      return currencyRate;
    },
  };
};

export default ExchangeService;
