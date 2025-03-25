import React from 'react';
import FirebaseFunctionsModule from '../modules/FirebaseFunctionsModule';
import { PublicConfigType } from '../../../types/internal/PublicConfigType';
import { PublicConfigReadRequestType } from '../../../types/api/admin/PublicConfigReadRequestType';
import { PublicConfigReadResponseType } from '../../../types/api/admin/PublicConfigReadResponseType';

export interface UseInitConfigProps {
  locale: string;
  currency: string;
}

const useInitConfig = (props: UseInitConfigProps): PublicConfigType => {
  const [config, setConfig] = React.useState<PublicConfigType>({
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD'],
    authenticationMethods: [],
    attributesToFilter: [],
    headerHeight: 0,
    hasInvitations: false,
    hasRequiredInvitation: false,
  });

  React.useEffect(() => {
    const syncConfig = async () => {
      const response = await FirebaseFunctionsModule<
        PublicConfigReadRequestType,
        PublicConfigReadResponseType
      >().call('/admin/config/read', {}, props.locale, props.currency);
      setConfig(response.config);
    };

    syncConfig();
  }, []);

  return config;
};

export default useInitConfig;
