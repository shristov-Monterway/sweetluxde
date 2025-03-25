import React from 'react';
import { CurrencyContextType } from '../contexts/AppContext';
import { UserType } from '../../../types/internal/UserType';

export interface UseSyncUserCurrencyProps {
  currency: CurrencyContextType;
  user: UserType | null;
}

const useSyncUserCurrency = (props: UseSyncUserCurrencyProps): void => {
  React.useEffect(() => {
    if (props.user && props.user.currency) {
      props.currency.set(props.user.currency);
    }
  }, [props.user]);
};

export default useSyncUserCurrency;
