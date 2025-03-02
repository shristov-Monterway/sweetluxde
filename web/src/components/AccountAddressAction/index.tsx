import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AddressForm from '../AddressForm';
import { AddressType } from '../../../../types/internal/AddressType';

export interface AccountAddressActionProps extends AbstractComponentType {
  action: 'new' | 'edit';
  isAddressOpened: boolean;
  setIsAddressOpened: (isAddressOpened: boolean) => void;
  address?: AddressType;
  addressIndex?: number;
  hasLabel?: boolean;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

const AccountAddressAction = (
  props: AccountAddressActionProps
): React.JSX.Element | null => {
  const app = useApp();
  const hasLabel = typeof props.hasLabel === 'boolean' ? props.hasLabel : true;

  if (!app.user) {
    return null;
  }

  return (
    <div
      className={`account-address-action ${props.isAddressOpened ? 'account-address-action--active' : ''} ${props.className ? props.className : ''}`}
    >
      {hasLabel ? (
        <button
          className={`account-address-action__button btn ${props.isAddressOpened ? 'btn-outline-danger' : 'btn-primary'}`}
          onClick={() => props.setIsAddressOpened(!props.isAddressOpened)}
        >
          {props.isAddressOpened ? (
            <i className="fe fe-minus-circle" />
          ) : (
            app.translator.t(
              `components.accountAddressAction.${props.action}Label`
            )
          )}
        </button>
      ) : null}
      <AddressForm
        className="account-address-action__form"
        address={props.address}
        addressIndex={props.addressIndex}
        onSuccess={() => {
          props.setIsAddressOpened(false);
          if (props.onSuccess) {
            props.onSuccess();
          }
        }}
        onFailure={props.onFailure}
      />
    </div>
  );
};

export default AccountAddressAction;
