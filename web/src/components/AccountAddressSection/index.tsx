import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AccountAddresses from '../AccountAddresses';

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
      <AccountAddresses />
    </div>
  );
};

export default AccountAddressSection;
