import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import useApp from '../../hooks/useApp';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';
import cc, { CurrencyCodeRecord } from 'currency-codes';

export interface CurrencyModalProps extends AbstractComponentType {
  showModal: boolean;
}

const CurrencyModal = (props: CurrencyModalProps): React.JSX.Element => {
  const app = useApp();
  const [search, setSearch] = React.useState<string>('');

  const onPress = (newCurrency: string) => {
    if (app.user) {
      FirestoreModule<UserType>().writeDoc('users', app.user.uid, {
        ...app.user,
        currency: newCurrency,
      });
    } else {
      app.currency.set(newCurrency);
    }
  };

  return (
    <Modal
      showModal={props.showModal}
      className={`${props.className ? props.className : ''}`}
      header={
        <input
          className="form-control"
          type="text"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(event.target.value)
          }
          placeholder={app.translator.t('components.currencyModal.search')}
        />
      }
      hasCloseButton={true}
      hasCloseWithBackground={true}
    >
      <div className="d-flex flex-wrap gap-1">
        {app.config.supportedCurrencies
          .filter((currency) => cc.code(currency) !== undefined)
          .map((currency) => cc.code(currency) as CurrencyCodeRecord)
          .filter((currency) => {
            return currency.currency
              .toLowerCase()
              .includes(search.toLowerCase());
          })
          .map((supportedCurrency, index) => (
            <button
              key={index}
              className={`btn ${app.currency.get === supportedCurrency.code ? 'btn-primary' : 'btn-light'}`}
              onClick={() => onPress(supportedCurrency.code)}
            >
              {supportedCurrency.currency}
            </button>
          ))}
      </div>
    </Modal>
  );
};

export default CurrencyModal;
