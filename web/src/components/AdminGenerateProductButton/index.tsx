import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { ProductFixtureRequestType } from '../../../../types/api/admin/ProductFixtureRequestType';
import { ProductFixtureResponseType } from '../../../../types/api/admin/ProductFixtureResponseType';
import LoadingButton from '../LoadingButton';

export type AdminGenerateProductButtonProps = AbstractComponentType;

const AdminGenerateProductButton = (
  props: AdminGenerateProductButtonProps
): React.JSX.Element | null => {
  const app = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

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
      ProductFixtureRequestType,
      ProductFixtureResponseType
    >().call(
      '/admin/product/fixture',
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
      label={app.translator.t('components.adminGenerateProductButton.label')}
      onClick={onPress}
      className={props.className ? props.className : ''}
    />
  );
};

export default AdminGenerateProductButton;
