import React from 'react';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import WishlistProductsList from '../src/components/WishlistProductsList';

const Wishlist = (): React.JSX.Element => {
  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <WishlistProductsList />
    </Page>
  );
};

export default Wishlist;
