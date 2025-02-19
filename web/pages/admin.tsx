import React from 'react';
import useApp from '../src/hooks/useApp';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import AdminProductsList from '../src/components/AdminProductsList';
import AdminCategoriesList from '../src/components/AdminCategoriesList';
import AdminSyncCurrenciesButton from '../src/components/AdminSyncCurrenciesButton';
import AdminGenerateProductButton from '../src/components/AdminGenerateProductButton';
import NotFound from 'next/error';
import Link from 'next/link';
import SideNavContainer from '../src/components/SideNavContainer';
import SignOutButton from '../src/components/SignOutButton';

const Admin = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

  const sections: {
    id: string;
    label: string | React.JSX.Element;
    element?: React.JSX.Element;
    className?: string;
  }[] = [
    {
      id: 'products',
      label: 'View products',
      element: <AdminProductsList />,
      className: 'btn btn-outline-primary w-100',
    },
    {
      id: 'categories',
      label: 'View categories',
      element: <AdminCategoriesList />,
      className: 'btn btn-outline-primary w-100',
    },
    {
      id: 'newProduct',
      label: (
        <Link href="/admin/product/new" passHref={true}>
          <a className="btn btn-primary w-100">New product</a>
        </Link>
      ),
    },
    {
      id: 'newCategory',
      label: (
        <Link href="/admin/category/new" passHref={true}>
          <a className="btn btn-primary w-100">New category</a>
        </Link>
      ),
    },
    {
      id: 'divider',
      label: <hr />,
    },
    {
      id: 'syncCurrencies',
      label: (
        <AdminSyncCurrenciesButton className="btn btn-outline-primary w-100" />
      ),
    },
  ];

  if (process.env.NODE_ENV === 'development') {
    sections.push({
      id: 'generateProduct',
      label: (
        <AdminGenerateProductButton className="btn btn-outline-primary w-100" />
      ),
    });
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <SideNavContainer isSideBarFixed={true} sections={sections} />
    </Page>
  );
};

export default Admin;
