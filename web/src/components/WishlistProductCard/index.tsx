import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import Price from '../Price';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { WishlistUpdateRequestType } from '../../../../types/api/wishlist/WishlistUpdateRequestType';
import { WishlistUpdateResponseType } from '../../../../types/api/wishlist/WishlistUpdateResponseType';
import Link from 'next/link';
import { CartAddFromWishlistRequestType } from '../../../../types/api/cart/CartAddFromWishlistRequestType';
import { CartAddFromWishlistResponseType } from '../../../../types/api/cart/CartAddFromWishlistResponseType';
import Weight from '../Weight';

export interface WishlistProductCardProps extends AbstractComponentType {
  product: ProductType;
  variationUid: string;
  attributes: {
    [uid: string]: string;
  };
  quantity: number;
}

const WishlistProductCard = (
  props: WishlistProductCardProps
): React.JSX.Element => {
  const app = useApp();
  const variation = props.product.variations[props.variationUid];
  const [productName, setProductName] = React.useState<string>('');
  const [variationName, setVariationName] = React.useState<string>('');
  const [productAttributeNames, setProductAttributeNames] = React.useState<{
    [attributeId: string]: string;
  }>(
    Object.keys(props.product.variations[props.variationUid].attributes).reduce(
      (productAttributeNames, uid) => ({
        ...productAttributeNames,
        [uid]: props.product.variations[props.variationUid].attributes[uid]
          .name[app.translator.locale]
          ? props.product.variations[props.variationUid].attributes[uid].name[
              app.translator.locale
            ]
          : props.product.variations[props.variationUid].attributes[uid].name[
              Object.keys(
                props.product.variations[props.variationUid].attributes[uid]
                  .name
              )[0]
            ],
      }),
      {}
    )
  );
  const [productAttributesOptionNames, setProductAttributesOptionNames] =
    React.useState<{
      [attributeId: string]: {
        [optionId: string]: string;
      };
    }>(
      Object.keys(
        props.product.variations[props.variationUid].attributes
      ).reduce(
        (productAttributesOptionNames, attributeId) => ({
          ...productAttributesOptionNames,
          [attributeId]: Object.keys(
            props.product.variations[props.variationUid].attributes[attributeId]
              .options
          ).reduce(
            (optionNames, optionId) => ({
              ...optionNames,
              [optionId]: props.product.variations[props.variationUid]
                .attributes[attributeId].options[optionId].name[
                app.translator.locale
              ]
                ? props.product.variations[props.variationUid].attributes[
                    attributeId
                  ].options[optionId].name[app.translator.locale]
                : props.product.variations[props.variationUid].attributes[
                    attributeId
                  ].options[optionId].name[
                    Object.keys(
                      props.product.variations[props.variationUid].attributes[
                        attributeId
                      ].options[optionId].name
                    )[0]
                  ],
            }),
            {}
          ),
        }),
        {}
      )
    );

  React.useEffect(() => {
    const productName = props.product.name[app.translator.locale]
      ? props.product.name[app.translator.locale]
      : props.product.name[Object.keys(props.product.name)[0]];

    const variationName = variation.name[app.translator.locale]
      ? variation.name[app.translator.locale]
      : variation.name[Object.keys(variation.name)[0]];

    setProductName(productName);
    setVariationName(variationName);

    setProductAttributeNames(
      Object.keys(
        props.product.variations[props.variationUid].attributes
      ).reduce(
        (productAttributeNames, uid) => ({
          ...productAttributeNames,
          [uid]: props.product.variations[props.variationUid].attributes[uid]
            .name[app.translator.locale]
            ? props.product.variations[props.variationUid].attributes[uid].name[
                app.translator.locale
              ]
            : props.product.variations[props.variationUid].attributes[uid].name[
                Object.keys(
                  props.product.variations[props.variationUid].attributes[uid]
                    .name
                )[0]
              ],
        }),
        {}
      )
    );

    setProductAttributesOptionNames(
      Object.keys(
        props.product.variations[props.variationUid].attributes
      ).reduce(
        (productAttributesOptionNames, attributeId) => ({
          ...productAttributesOptionNames,
          [attributeId]: Object.keys(
            props.product.variations[props.variationUid].attributes[attributeId]
              .options
          ).reduce(
            (optionNames, optionId) => ({
              ...optionNames,
              [optionId]: props.product.variations[props.variationUid]
                .attributes[attributeId].options[optionId].name[
                app.translator.locale
              ]
                ? props.product.variations[props.variationUid].attributes[
                    attributeId
                  ].options[optionId].name[app.translator.locale]
                : props.product.variations[props.variationUid].attributes[
                    attributeId
                  ].options[optionId].name[
                    Object.keys(
                      props.product.variations[props.variationUid].attributes[
                        attributeId
                      ].options[optionId].name
                    )[0]
                  ],
            }),
            {}
          ),
        }),
        {}
      )
    );
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
        attributes: props.attributes,
        quantity,
      },
      app.translator.locale,
      app.currency.get
    );
  };

  const addToCart = async () => {
    if (!app.user) {
      app.activeModal.set('authModal');
    } else {
      await FirebaseFunctionsModule<
        CartAddFromWishlistRequestType,
        CartAddFromWishlistResponseType
      >().call(
        '/cart/cart/add-from-wishlist',
        {
          product: props.product.uid,
          variation: props.variationUid,
          attributes: props.attributes,
        },
        app.translator.locale,
        app.currency.get
      );
    }
  };

  return (
    <div className={`card ${props.className ? props.className : ''}`}>
      <div className="card-body wishlist-product-card__body">
        <Link href={`/product/${props.product.uid}`} passHref={true}>
          <a>
            {variation.images.length > 0 ? (
              <img
                className="wishlist-product-card__image"
                src={variation.images[0]}
                alt=""
              />
            ) : (
              <img
                className="wishlist-product-card__image"
                src="/placeholder.webp"
                alt=""
              />
            )}
          </a>
        </Link>
        <div className="wishlist-product-card__info">
          <div className="d-flex flex-column gap-3">
            <Link href={`/product/${props.product.uid}`} passHref={true}>
              <a className="h2 card-title p-0 m-0">{productName}</a>
            </Link>
            <hr className="m-0 p-0" />
            <span className="h4 m-0 p-0">{variationName}</span>
            {Object.keys(props.attributes).length > 0 ? (
              <div>
                {Object.keys(props.attributes).map((attributeId, index) => (
                  <span key={index}>
                    {productAttributeNames[attributeId]}:{' '}
                    {
                      productAttributesOptionNames[attributeId][
                        props.attributes[attributeId]
                      ]
                    }
                  </span>
                ))}
              </div>
            ) : null}
            {variation.weight ? (
              <div>
                {app.translator.t('components.wishlistProductCard.weight')}{' '}
                <Weight
                  weight={variation.weight}
                  unit="gr"
                  className="p-0 m-0"
                />
              </div>
            ) : null}
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
          <div className="d-flex">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-xl-grow-0"
              onClick={addToCart}
            >
              {app.translator.t('components.productInfo.addToCart')}{' '}
              <span className="fe fe-shopping-cart"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
