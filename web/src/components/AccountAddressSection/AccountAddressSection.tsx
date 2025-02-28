import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AccountNewAddress from '../AccountNewAddress';
import AddressesList from '../AddressesList';

export type AccountAddressSectionProps = AbstractComponentType;

const AccountAddressSection = (
  props: AccountAddressSectionProps
): React.JSX.Element | null => {
  const app = useApp();

  if (!app.user) {
    return null;
  }

  return (
    <div
      className={`account-address-section card card-body ${props.className ? props.className : ''}`}
    >
      <AccountNewAddress />
      <AddressesList
        addresses={app.user.addresses}
        includeDeleteFunctionality={true}
      />
    </div>
  );
};

export default AccountAddressSection;
