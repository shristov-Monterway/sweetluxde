import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import Price from '../Price';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CartUpdateRequestType } from '../../../../types/api/cart/CartUpdateRequestType';
import { CartUpdateResponseType } from '../../../../types/api/cart/CartUpdateResponseType';
import { WishlistUpdateRequestType } from '../../../../types/api/wishlist/WishlistUpdateRequestType';
import { WishlistUpdateResponseType } from '../../../../types/api/wishlist/WishlistUpdateResponseType';
import Link from 'next/link';

export interface ProductCardProps extends AbstractComponentType {
  product: ProductType;
}

const mainSliderConfig = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ProductCard = (props: ProductCardProps): React.JSX.Element | null => {
  const app = useApp();
  const mainSlider = React.useRef<Carousel | null>(null);
  const [selectedProductVariationUid, setSelectedProductVariationUid] =
    React.useState<string>(Object.keys(props.product.variations)[0]);
  const [name, setName] = React.useState<string>('');
  const [productVariationNames, setProductVariationNames] = React.useState<{
    [uid: string]: string;
  }>({});
  const [tags, setTags] = React.useState<string[]>([]);
  const [badgeText, setBadgeText] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    const name = props.product.name[app.translator.locale]
      ? props.product.name[app.translator.locale]
      : props.product.name[Object.keys(props.product.name)[0]];

    const tags = props.product.tags.map((tag) =>
      tag[app.translator.locale]
        ? tag[app.translator.locale]
        : tag[Object.keys(tag)[0]]
    );

    const productVariationNames = Object.keys(props.product.variations).reduce(
      (productVariationNames, uid) => ({
        ...productVariationNames,
        [uid]: props.product.variations[uid].name[app.translator.locale]
          ? props.product.variations[uid].name[app.translator.locale]
          : props.product.variations[uid].name[
              Object.keys(props.product.variations[uid].name)[0]
            ],
      }),
      {}
    );

    const badgeText =
      props.product.badge && props.product.badge.text[app.translator.locale]
        ? props.product.badge.text[app.translator.locale]
        : props.product.badge
          ? props.product.badge.text[Object.keys(props.product.badge.text)[0]]
          : undefined;

    setName(name);
    setTags(tags);
    setProductVariationNames(productVariationNames);
    setBadgeText(badgeText);
  }, [app.translator.locale]);

  const images: string[] = [];
  const productVariationImageIndexes: {
    [uid: string]: number;
  } = {};

  Object.keys(props.product.variations).forEach((uid) => {
    productVariationImageIndexes[uid] = images.length;
    props.product.variations[uid].images.forEach((image) => {
      images.push(image);
    });
  });

  let isProductVariationAddedToWishlist = false;

  if (app.user) {
    const lineItemFromWishlist = app.user.wishlist.lineItems.find(
      (lineItem) =>
        lineItem.product === props.product.uid &&
        lineItem.variation === selectedProductVariationUid
    );
    isProductVariationAddedToWishlist = !!lineItemFromWishlist;
  }

  const selectProductVariation = (selectedProductVariationUid: string) => {
    setSelectedProductVariationUid(selectedProductVariationUid);
    mainSlider.current?.goToSlide(
      productVariationImageIndexes[selectedProductVariationUid]
    );
  };

  const addToCart = async () => {
    if (!app.user) {
      app.activeModal.set('authModal');
    } else {
      await FirebaseFunctionsModule<
        CartUpdateRequestType,
        CartUpdateResponseType
      >().call(
        '/cart/cart/update',
        {
          product: props.product.uid,
          variation: selectedProductVariationUid,
          quantity: 1,
        },
        app.translator.locale,
        app.currency.get
      );
    }
  };

  const addOrRemoveFromWishlist = async () => {
    if (!app.user) {
      app.activeModal.set('authModal');
    } else {
      await FirebaseFunctionsModule<
        WishlistUpdateRequestType,
        WishlistUpdateResponseType
      >().call(
        '/wishlist/wishlist/update',
        {
          product: props.product.uid,
          variation: selectedProductVariationUid,
          quantity: isProductVariationAddedToWishlist ? -1 : 1,
        },
        app.translator.locale,
        app.currency.get
      );
    }
  };

  return (
    <div className={`card ${props.className ? props.className : ''}`}>
      {props.product.badge ? (
        <span
          className={`product-card__badge badge bg-${props.product.badge.type}`}
        >
          {badgeText}
        </span>
      ) : null}
      <Carousel
        responsive={mainSliderConfig}
        ref={(slider) => (mainSlider.current = slider)}
      >
        {images.map((image, index) => (
          <img
            key={index}
            className="card-img-top product-card__main-slide-image"
            src={image}
            alt=""
          />
        ))}
      </Carousel>
      <div className="card-body product-card__body">
        <div className="product-card__actions">
          <button
            className={`btn btn-${isProductVariationAddedToWishlist ? 'primary' : 'outline-primary'} btn-rounded-circle`}
            onClick={addOrRemoveFromWishlist}
          >
            <i className="fe fe-bookmark" />
          </button>
        </div>
        <div className="product-card__content">
          <h2 className="product-card__content-title card-title m-0 p-0">
            {name}
          </h2>
          {tags.length > 0 ? (
            <h3 className="product-card__content-tags d-flex gap-3 flex-wrap p-0 m-0">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge border border-primary text-primary"
                >
                  {tag}
                </span>
              ))}
            </h3>
          ) : null}
          <div className="product-card__product-variations">
            {Object.keys(props.product.variations).map((uid, index) => (
              <button
                key={index}
                className={`btn btn-sm btn-${selectedProductVariationUid === uid ? 'primary' : 'outline-primary'}`}
                onClick={() => selectProductVariation(uid)}
              >
                {productVariationNames[uid]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="card-footer card-footer-boxed product-card__footer">
        <Price
          prices={[
            {
              currency: app.currency.get,
              value:
                props.product.variations[selectedProductVariationUid].price,
            },
          ]}
          className="h2 p-0 m-0"
        />
        <div className="product-card__footer-actions">
          <button className="btn btn-outline-success" onClick={addToCart}>
            <i className="fe fe-shopping-cart" />
          </button>
          <Link href={`/product/${props.product.uid}`} passHref={true}>
            <a className="btn btn-primary">
              {app.translator.t('components.productCard.open')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
