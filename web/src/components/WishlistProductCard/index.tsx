import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import Price from '../Price';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { WishlistUpdateRequestType } from '../../../../types/api/wishlist/WishlistUpdateRequestType';
import { WishlistUpdateResponseType } from '../../../../types/api/wishlist/WishlistUpdateResponseType';

export interface WishlistProductCardProps extends AbstractComponentType {
  product: ProductType;
  variationUid: string;
  quantity: number;
}

const WishlistProductCard = (
  props: WishlistProductCardProps
): React.JSX.Element => {
  const app = useApp();
  const variation = props.product.variations[props.variationUid];
  const [productName, setProductName] = React.useState<string>('');
  const [variationName, setVariationName] = React.useState<string>('');

  React.useEffect(() => {
    const productName = props.product.name[app.translator.locale]
      ? props.product.name[app.translator.locale]
      : props.product.name[Object.keys(props.product.name)[0]];

    const variationName = variation.name[app.translator.locale]
      ? variation.name[app.translator.locale]
      : variation.name[Object.keys(variation.name)[0]];

    setProductName(productName);
    setVariationName(variationName);
  }, [app.translator.locale]);

  const setNewQuantity = async (quantity: -1 | 1) => {
    await FirebaseFunctionsModule<
      WishlistUpdateRequestType,
      WishlistUpdateResponseType
    >().call(
      '/wishlist/wishlist/update',
      {
        product: props.product.uid,
        variation: props.variationUid,
        quantity,
      },
      app.translator.locale,
      app.currency.get
    );
  };

  return (
    <div className={`card ${props.className ? props.className : ''}`}>
      <div className="card-body wishlist-product-card__body">
        {variation.images.length > 0 ? (
          <img
            className="wishlist-product-card__image"
            src={variation.images[0]}
            alt=""
          />
        ) : null}
        <div className="d-flex flex-column gap-3 wishlist-product-card__info">
          <h2 className="card-title p-0 m-0">{productName}</h2>
          <hr className="m-0 p-0" />
          <span className="h4 m-0 p-0">{variationName}</span>
          <div className="d-flex justify-content-start align-items-center gap-3 flex-wrap">
            <div className="wishlist-product-card__quantity-container bg-primary-subtle border-primary">
              <button
                className="btn btn-sm btn-rounded-circle btn-white"
                onClick={() => setNewQuantity(-1)}
              >
                -
              </button>
              <span className="h3 m-0 p-0">{props.quantity}</span>
              <button
                className="btn btn-sm btn-rounded-circle btn-white"
                onClick={() => setNewQuantity(1)}
              >
                +
              </button>
            </div>
            <span className="h3 p-0 m-0">x</span>
            <Price
              prices={[
                {
                  currency: app.currency.get,
                  value: variation.price,
                },
              ]}
              className="h3 p-0 m-0"
            />
          </div>
          <hr className="m-0 p-0" />
          <Price
            prices={[
              {
                currency: app.currency.get,
                value: variation.price * props.quantity,
              },
            ]}
            className="h2 p-0 m-0"
          />
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
