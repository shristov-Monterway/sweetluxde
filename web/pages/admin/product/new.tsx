import React from 'react';
import Page from '../../../src/components/Page';
import Header from '../../../src/components/Header';
import ProductForm from '../../../src/components/ProductForm';

const AdminProductNew = (): React.JSX.Element => {
  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <ProductForm />
    </Page>
  );
};

export default AdminProductNew;
