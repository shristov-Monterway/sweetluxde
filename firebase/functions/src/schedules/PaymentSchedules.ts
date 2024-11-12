import { CloudFunctionSchedules } from '../types/CloudFunctionSchedules';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import Config from '../Config';
import ExchangeService from '../services/ExchangeService';
import FirestoreModule from '../modules/FirestoreModule';
import { CurrencyType } from '../../../../types/internal/CurrencyType';
import { CurrencyRatesType } from '../../../../types/internal/CurrencyRatesType';

const PaymentSchedules: CloudFunctionSchedules = {};

PaymentSchedules['paymentCurrenciesSync'] = onSchedule(
  'every day 00:00',
  async () => {
    await FirestoreModule<CurrencyType>().deleteCollectionDocs('currencies');
    await FirestoreModule<CurrencyRatesType>().deleteCollectionDocs(
      'currencyRates'
    );

    const currencies = await ExchangeService().getCurrencies();
    const supportedCurrencies = Config.supportedCurrencies;

    for (const supportedCurrency of supportedCurrencies) {
      const supportedCurrencyData = currencies.find(
        (currency) => currency.code == supportedCurrency
      );

      if (!supportedCurrencyData) {
        continue;
      }

      await FirestoreModule<CurrencyType>().writeDoc(
        'currencies',
        supportedCurrency,
        supportedCurrencyData
      );

      const currencyRates =
        await ExchangeService().getCurrencyRates(supportedCurrency);

      await FirestoreModule<CurrencyRatesType>().writeDoc(
        'currencyRates',
        supportedCurrency,
        currencyRates
      );
    }
  }
);

export default PaymentSchedules;
