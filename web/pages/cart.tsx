import React from 'react';
import Page from '../src/components/Page';
import CartProductsList from '../src/components/CartProductsList';
import CartOverview from '../src/components/CartOverview';

const Cart = (): React.JSX.Element => {
  return (
    <Page isFluid={false}>
      <CartProductsList />
      <hr />
      <CartOverview />
    </Page>
  );
};

export default Cart;
