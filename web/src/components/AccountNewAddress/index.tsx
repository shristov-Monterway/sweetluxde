import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AddressForm from '../AddressForm';

export interface AccountNewAddressProps extends AbstractComponentType {
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

const AccountNewAddress = (
  props: AccountNewAddressProps
): React.JSX.Element | null => {
  const app = useApp();
  const [isNewAddressOpened, setIsNewAddressOpened] =
    React.useState<boolean>(false);

  if (!app.user) {
    return null;
  }

  return (
    <div
      className={`account-new-address ${isNewAddressOpened ? 'account-new-address--active' : ''} ${props.className ? props.className : ''}`}
    >
      <button
        className={`account-new-address__button btn ${isNewAddressOpened ? 'btn-outline-danger' : 'btn-primary'}`}
        onClick={() =>
          setIsNewAddressOpened((isNewAddressOpened) => !isNewAddressOpened)
        }
      >
        {isNewAddressOpened ? (
          <i className="fe fe-minus-circle" />
        ) : (
          app.translator.t('components.accountNewAddress.openNewAddress')
        )}
      </button>
      <AddressForm
        className="account-new-address__form"
        onSuccess={() => {
          setIsNewAddressOpened(false);
          if (props.onSuccess) {
            props.onSuccess();
          }
        }}
        onFailure={props.onFailure}
      />
    </div>
  );
};

export default AccountNewAddress;
