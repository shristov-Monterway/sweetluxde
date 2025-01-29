import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CurrenciesSyncRequestType } from '../../../../types/api/admin/CurrenciesSyncRequestType';
import { CurrenciesSyncResponseType } from '../../../../types/api/admin/CurrenciesSyncResponseType';

export interface AdminSyncCurrenciesButtonProps extends AbstractComponentType {
  children?: React.JSX.Element | React.JSX.Element[];
}

const AdminSyncCurrenciesButton = (
  props: AdminSyncCurrenciesButtonProps
): React.JSX.Element => {
  const app = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onPress = (): void => {
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

    FirebaseFunctionsModule<
      CurrenciesSyncRequestType,
      CurrenciesSyncResponseType
    >()
      .call(
        '/admin/currencies/sync',
        {},
        app.translator.locale,
        app.currency.get
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <button
        className={`btn btn-primary ${isLoading ? 'disabled' : ''} ${props.className ? props.className : ''}`}
        onClick={onPress}
      >
        {props.children ? (
          props.children
        ) : (
          <span>
            {app.translator.t('components.adminSyncCurrenciesButton.label')}
          </span>
        )}
      </button>
      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}
    </div>
  );
};

export default AdminSyncCurrenciesButton;
