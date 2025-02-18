import React from 'react';
import useApp from '../../../src/hooks/useApp';
import Page from '../../../src/components/Page';
import Header from '../../../src/components/Header';
import CategoryForm from '../../../src/components/CategoryForm';
import NotFound from 'next/error';

const AdminCategoryNew = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <CategoryForm />
    </Page>
  );
};

export default AdminCategoryNew;
