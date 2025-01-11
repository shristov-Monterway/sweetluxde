import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import { ProductType } from '../../../../types/internal/ProductType';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Price from '../Price';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CartUpdateRequestType } from '../../../../types/api/cart/CartUpdateRequestType';
import { CartUpdateResponseType } from '../../../../types/api/cart/CartUpdateResponseType';

export interface ProductInfoProps extends AbstractComponentType {
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

const ProductInfo = (props: ProductInfoProps): React.JSX.Element => {
  const app = useApp();
  const mainSlider = React.useRef<Carousel | null>(null);
  const [selectedProductVariationUid, setSelectedProductVariationUid] =
    React.useState<string>(Object.keys(props.product.variations)[0]);
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [productVariationNames, setProductVariationNames] = React.useState<{
    [uid: string]: string;
  }>({});
  const [productVariationDescriptions, setProductVariationDescriptions] =
    React.useState<{
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

    const description = props.product.description[app.translator.locale]
      ? props.product.description[app.translator.locale]
      : props.product.description[Object.keys(props.product.description)[0]];

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

    const productVariationDescriptions = Object.keys(
      props.product.variations
    ).reduce(
      (productVariationDescriptions, uid) => ({
        ...productVariationDescriptions,
        [uid]: props.product.variations[uid].description[app.translator.locale]
          ? props.product.variations[uid].description[app.translator.locale]
          : props.product.variations[uid].description[
              Object.keys(props.product.variations[uid].description)[0]
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
    setDescription(description);
    setTags(tags);
    setProductVariationNames(productVariationNames);
    setProductVariationDescriptions(productVariationDescriptions);
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

  return (
    <div className={`product-info ${props.className ? props.className : ''}`}>
      <div className="product-info__slides">
        {props.product.badge ? (
          <span
            className={`product-info__badge badge bg-${props.product.badge.type}`}
          >
            {badgeText}
          </span>
        ) : null}
        {images.length > 0 ? (
          <Carousel
            responsive={mainSliderConfig}
            containerClass="rounded"
            ref={(slider) => (mainSlider.current = slider)}
          >
            {images.map((image, index) => (
              <img
                key={index}
                className="product-info__main-slide-image"
                src={image}
                alt=""
              />
            ))}
          </Carousel>
        ) : (
          <img
            className="product-info__main-slide-image"
            src="/placeholder.webp"
            alt=""
          />
        )}
        <div className="product-info__nav-slider">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                mainSlider.current?.goToSlide(index);
              }}
            >
              <img
                className="product-info__nav-slide-image rounded"
                src={image}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
      <div className="product-info__info">
        <h1 className="p-0 m-0">{name}</h1>
        <p className="p-0 m-0">{description}</p>
        {tags.length > 0 ? (
          <h3 className="d-flex gap-3 flex-wrap p-0 m-0">
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
        <hr className="p-0 m-0" />
        {Object.keys(props.product.variations).length > 1 ? (
          <div className="product-info__product-variations">
            {Object.keys(props.product.variations).map((uid, index) => (
              <button
                key={index}
                className={`btn btn-${selectedProductVariationUid === uid ? 'primary' : 'outline-primary'}`}
                onClick={() => selectProductVariation(uid)}
              >
                {productVariationNames[uid]}
              </button>
            ))}
          </div>
        ) : null}
        <p className="p-0 m-0">
          {productVariationDescriptions[selectedProductVariationUid]}
        </p>
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
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
          onClick={addToCart}
        >
          {app.translator.t('components.productInfo.addToCart')}{' '}
          <span className="fe fe-shopping-cart"></span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
