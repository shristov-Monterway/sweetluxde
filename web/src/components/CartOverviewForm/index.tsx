import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CheckoutNewRequestType } from '../../../../types/api/payment/CheckoutNewRequestType';
import { CheckoutNewResponseType } from '../../../../types/api/payment/CheckoutNewResponseType';
import { CheckoutPreviewResponseType } from '../../../../types/api/payment/CheckoutPreviewResponseType';
import { CheckoutPreviewRequestType } from '../../../../types/api/payment/CheckoutPreviewRequestType';
import Price from '../Price';
import LoadingButton from '../LoadingButton';
import AccountAddresses from '../AccountAddresses';

export type CartOverviewFormProps = AbstractComponentType;

const CartOverviewForm = (
  props: CartOverviewFormProps
): React.JSX.Element | null => {
  const id = 'cartOverview';
  const app = useApp();
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [totalPriceCurrency, setTotalPriceCurrency] = React.useState<
    string | null
  >(null);
  const [isCheckoutCreationLoading, setIsCheckoutCreationLoading] =
    React.useState<boolean>(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState<
    number | null
  >(null);

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

  React.useEffect(() => {
    if (!app.user) {
      setSelectedAddressIndex(null);
      return;
    }

    const addresses = app.user.addresses;

    setSelectedAddressIndex(addresses.length > 0 ? 0 : null);
  }, [app.user]);

  const onClick = async () => {
    if (isCheckoutCreationLoading) {
      return;
    }

    if (!app.user) {
      return;
    }

    if (
      selectedAddressIndex === null ||
      typeof app.user.addresses[selectedAddressIndex] === 'undefined'
    ) {
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
        address: app.user.addresses[selectedAddressIndex],
      },
      app.translator.locale,
      app.currency.get
    );

    if (window) {
      window.open(response.url, '_blank');
    }

    setIsCheckoutCreationLoading(false);
  };

  if (!app.user) {
    return null;
  }

  return (
    <div
      className={`cart-overview-form ${props.className ? props.className : ''}`}
    >
      <div className="cart-overview-form__address">
        <AccountAddresses
          form={id}
          field="address"
          selectedAddressIndex={selectedAddressIndex}
          setSelectedAddressIndex={setSelectedAddressIndex}
        />
      </div>
      {totalPrice && totalPriceCurrency ? (
        <div className="cart-overview-form__price-container">
          <div className="h2 cart-overview-form__total-price-container">
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

export default CartOverviewForm;
