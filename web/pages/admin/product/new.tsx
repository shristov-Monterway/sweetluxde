import React from 'react';
import useApp from '../../../src/hooks/useApp';
import Page from '../../../src/components/Page';
import Header from '../../../src/components/Header';
import ProductForm from '../../../src/components/ProductForm';
import NotFound from 'next/error';
import { useRouter } from 'next/router';

const AdminProductNew = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header />}>
      <ProductForm
        onSuccess={(product) => {
          app.products.refresh().then(() => {
            router.push(`/product/${product.uid}`);
          });
        }}
      />
    </Page>
  );
};

export default AdminProductNew;
