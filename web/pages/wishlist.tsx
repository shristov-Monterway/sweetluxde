import React from 'react';
import useApp from '../src/hooks/useApp';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import WishlistProductsList from '../src/components/WishlistProductsList';

const Wishlist = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header />}>
      <WishlistProductsList />
    </Page>
  );
};

export default Wishlist;
