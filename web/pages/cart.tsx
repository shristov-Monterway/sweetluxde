import React from 'react';
import useApp from '../src/hooks/useApp';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import CartProductsList from '../src/components/CartProductsList';
import CartOverviewForm from '../src/components/CartOverviewForm';

const Cart = (): React.JSX.Element => {
  const app = useApp();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header />}>
      <div className="row">
        <div className="col-lg-8">
          <CartProductsList />
        </div>
        <div className="col-lg-4">
          <CartOverviewForm />
        </div>
      </div>
    </Page>
  );
};

export default Cart;
