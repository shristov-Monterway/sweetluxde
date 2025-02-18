import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CheckoutNewRequestType } from '../../../../types/api/payment/CheckoutNewRequestType';
import { CheckoutNewResponseType } from '../../../../types/api/payment/CheckoutNewResponseType';
import { CheckoutPreviewResponseType } from '../../../../types/api/payment/CheckoutPreviewResponseType';
import { CheckoutPreviewRequestType } from '../../../../types/api/payment/CheckoutPreviewRequestType';
import Price from '../Price';
import LoadingButton from '../LoadingButton/LoadingButton';

export type CartOverviewProps = AbstractComponentType;

const CartOverview = (props: CartOverviewProps): React.JSX.Element => {
  const app = useApp();
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [totalPriceCurrency, setTotalPriceCurrency] = React.useState<
    string | null
  >(null);
  const [isCheckoutCreationLoading, setIsCheckoutCreationLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const makeCheckoutPreview = async () => {
      if (!app.user) {
        return;
      } else {
        const response = await FirebaseFunctionsModule<
          CheckoutPreviewRequestType,
          CheckoutPreviewResponseType
        >().call(
          '/payment/checkout/preview',
          {
            lineItems: app.user.cart.lineItems,
          },
          app.translator.locale,
          app.currency.get
        );

        setTotalPrice(response.totalPrice);
        setTotalPriceCurrency(response.currency);
      }
    };

    makeCheckoutPreview();
  }, [app.user, app.currency.get, app.translator.locale]);

  const onClick = async () => {
    if (isCheckoutCreationLoading) {
      return;
    }

    if (!app.user) {
      return;
    }

    setIsCheckoutCreationLoading(true);

    const response = await FirebaseFunctionsModule<
      CheckoutNewRequestType,
      CheckoutNewResponseType
    >().call(
      '/payment/checkout/new',
      {
        lineItems: app.user.cart.lineItems,
        successUrl: 'http://localhost:3000/',
      },
      app.translator.locale,
      app.currency.get
    );

    if (window) {
      window.open(response.url, '_blank');
    }

    setIsCheckoutCreationLoading(false);
  };

  return (
    <div className={`${props.className ? props.className : ''}`}>
      {totalPrice && totalPriceCurrency ? (
        <div>
          <div className="d-flex gap-3 h2">
            {app.translator.t('components.cartOverview.totalPrice')}
            <Price
              prices={[
                {
                  value: totalPrice,
                  currency: totalPriceCurrency,
                },
              ]}
            />
          </div>
          <LoadingButton
            isLoading={isCheckoutCreationLoading}
            label={app.translator.t('components.cartOverview.placeOrder')}
            onClick={onClick}
            className="btn btn-primary"
          />
        </div>
      ) : null}
    </div>
  );
};

export default CartOverview;
