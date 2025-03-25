import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CurrenciesSyncRequestType } from '../../../../types/api/admin/CurrenciesSyncRequestType';
import { CurrenciesSyncResponseType } from '../../../../types/api/admin/CurrenciesSyncResponseType';
import LoadingButton from '../LoadingButton';

export type AdminSyncCurrenciesButtonProps = AbstractComponentType;

const AdminSyncCurrenciesButton = (
  props: AdminSyncCurrenciesButtonProps
): React.JSX.Element => {
  const app = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onPress = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (!app.user) {
      return;
    }

    if (!app.user.isAdmin) {
      return;
    }

    setIsLoading(true);

    await FirebaseFunctionsModule<
      CurrenciesSyncRequestType,
      CurrenciesSyncResponseType
    >().call(
      '/admin/currencies/sync',
      {},
      app.translator.locale,
      app.currency.get
    );

    setIsLoading(false);

    if (location) {
      location.reload();
    }
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      label={app.translator.t('components.adminSyncCurrenciesButton.label')}
      onClick={onPress}
      className={props.className ? props.className : ''}
    />
  );
};

export default AdminSyncCurrenciesButton;
