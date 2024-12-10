import React from 'react';
import useApp from '../src/hooks/useApp';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import CartProductsList from '../src/components/CartProductsList';
import CartOverview from '../src/components/CartOverview';

const Cart = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <CartProductsList />
      <hr />
      <CartOverview />
    </Page>
  );
};

export default Cart;
