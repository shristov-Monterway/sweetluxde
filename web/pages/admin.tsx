import React from 'react';
import useApp from '../src/hooks/useApp';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import AdminProductsList from '../src/components/AdminProductsList';
import AdminSyncCurrenciesButton from '../src/components/AdminSyncCurrenciesButton';
import AdminGenerateProductButton from '../src/components/AdminGenerateProductButton';

const Admin = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <div className="d-flex flex-column gap-3">
        <AdminSyncCurrenciesButton className="flex-grow-1" />
        <AdminGenerateProductButton className="flex-grow-1" />
        <AdminProductsList />
      </div>
    </Page>
  );
};

export default Admin;
