import React from 'react';
import useApp from '../../../src/hooks/useApp';
import Page from '../../../src/components/Page';
import Header from '../../../src/components/Header';
import ProductForm from '../../../src/components/ProductForm';
import NotFound from 'next/error';

const AdminProductNew = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <ProductForm />
    </Page>
  );
};

export default AdminProductNew;
