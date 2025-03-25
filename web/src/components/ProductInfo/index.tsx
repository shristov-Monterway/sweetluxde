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
import FormField from '../FormField';
import { WishlistUpdateRequestType } from '../../../../types/api/wishlist/WishlistUpdateRequestType';
import { WishlistUpdateResponseType } from '../../../../types/api/wishlist/WishlistUpdateResponseType';
import Link from 'next/link';

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
  const [selectedAttributes, setSelectedAttributes] = React.useState<{
    [uid: string]: string;
  }>(
    Object.keys(
      props.product.variations[selectedProductVariationUid].attributes
    ).reduce(
      (attributes, attributeId) => ({
        ...attributes,
        [attributeId]: Object.keys(
          props.product.variations[selectedProductVariationUid].attributes[
            attributeId
          ].options
        )[0],
      }),
      {}
    )
  );
  const [productAttributeNames, setProductAttributeNames] = React.useState<{
    [attributeId: string]: string;
  }>(
    Object.keys(
      props.product.variations[selectedProductVariationUid].attributes
    ).reduce(
      (productAttributeNames, uid) => ({
        ...productAttributeNames,
        [uid]: props.product.variations[selectedProductVariationUid].attributes[
          uid
        ].name[app.translator.locale]
          ? props.product.variations[selectedProductVariationUid].attributes[
              uid
            ].name[app.translator.locale]
          : props.product.variations[selectedProductVariationUid].attributes[
              uid
            ].name[
              Object.keys(
                props.product.variations[selectedProductVariationUid]
                  .attributes[uid].name
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
        props.product.variations[selectedProductVariationUid].attributes
      ).reduce(
        (productAttributesOptionNames, attributeId) => ({
          ...productAttributesOptionNames,
          [attributeId]: Object.keys(
            props.product.variations[selectedProductVariationUid].attributes[
              attributeId
            ].options
          ).reduce(
            (optionNames, optionId) => ({
              ...optionNames,
              [optionId]: props.product.variations[selectedProductVariationUid]
                .attributes[attributeId].options[optionId].name[
                app.translator.locale
              ]
                ? props.product.variations[selectedProductVariationUid]
                    .attributes[attributeId].options[optionId].name[
                    app.translator.locale
                  ]
                : props.product.variations[selectedProductVariationUid]
                    .attributes[attributeId].options[optionId].name[
                    Object.keys(
                      props.product.variations[selectedProductVariationUid]
                        .attributes[attributeId].options[optionId].name
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
  }, [app.translator.locale, props.product]);

  React.useEffect(() => {
    setSelectedAttributes(
      Object.keys(
        props.product.variations[selectedProductVariationUid].attributes
      ).reduce(
        (attributes, attributeId) => ({
          ...attributes,
          [attributeId]: Object.keys(
            props.product.variations[selectedProductVariationUid].attributes[
              attributeId
            ].options
          )[0],
        }),
        {}
      )
    );
  }, [selectedProductVariationUid]);

  React.useEffect(() => {
    setProductAttributeNames(
      Object.keys(
        props.product.variations[selectedProductVariationUid].attributes
      ).reduce(
        (productAttributeNames, uid) => ({
          ...productAttributeNames,
          [uid]: props.product.variations[selectedProductVariationUid]
            .attributes[uid].name[app.translator.locale]
            ? props.product.variations[selectedProductVariationUid].attributes[
                uid
              ].name[app.translator.locale]
            : props.product.variations[selectedProductVariationUid].attributes[
                uid
              ].name[
                Object.keys(
                  props.product.variations[selectedProductVariationUid]
                    .attributes[uid].name
                )[0]
              ],
        }),
        {}
      )
    );

    setProductAttributesOptionNames(
      Object.keys(
        props.product.variations[selectedProductVariationUid].attributes
      ).reduce(
        (productAttributesOptionNames, attributeId) => ({
          ...productAttributesOptionNames,
          [attributeId]: Object.keys(
            props.product.variations[selectedProductVariationUid].attributes[
              attributeId
            ].options
          ).reduce(
            (optionNames, optionId) => ({
              ...optionNames,
              [optionId]: props.product.variations[selectedProductVariationUid]
                .attributes[attributeId].options[optionId].name[
                app.translator.locale
              ]
                ? props.product.variations[selectedProductVariationUid]
                    .attributes[attributeId].options[optionId].name[
                    app.translator.locale
                  ]
                : props.product.variations[selectedProductVariationUid]
                    .attributes[attributeId].options[optionId].name[
                    Object.keys(
                      props.product.variations[selectedProductVariationUid]
                        .attributes[attributeId].options[optionId].name
                    )[0]
                  ],
            }),
            {}
          ),
        }),
        {}
      )
    );
  }, [selectedProductVariationUid, app.translator.locale]);

  let isProductVariationAddedToWishlist = false;

  if (app.user) {
    const lineItemFromWishlist = app.user.wishlist.lineItems.find(
      (lineItem) =>
        lineItem.product === props.product.uid &&
        lineItem.variation === selectedProductVariationUid &&
        JSON.stringify(lineItem.attributes) ===
          JSON.stringify(selectedAttributes)
    );
    isProductVariationAddedToWishlist = !!lineItemFromWishlist;
  }

  const images: string[] = [];
  const productVariationImageIndexes: {
    [uid: string]: number;
  } = {};

  Object.keys(props.product.variations).forEach((uid) => {
    if (props.product.variations[uid].images.length > 0) {
      productVariationImageIndexes[uid] = images.length;
      props.product.variations[uid].images.forEach((image) => {
        images.push(image);
      });
    }
  });

  const selectProductVariation = (selectedProductVariationUid: string) => {
    setSelectedProductVariationUid(selectedProductVariationUid);
    if (
      props.product.variations[selectedProductVariationUid].images.length > 0
    ) {
      mainSlider.current?.goToSlide(
        productVariationImageIndexes[selectedProductVariationUid]
      );
    }
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
          attributes: selectedAttributes,
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
          attributes: selectedAttributes,
          quantity: isProductVariationAddedToWishlist ? -1 : 1,
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
        {props.product.categoryUids.length > 0 ? (
          <div className="d-flex align-items-center column-gap-3 flex-wrap">
            {props.product.categoryUids
              .map((categoryUid) => {
                const category = app.categories.get.find(
                  (category) => category.uid === categoryUid
                );
                if (!category) {
                  throw new Error('Category not found!');
                }
                return category;
              })
              .map((category, index) => (
                <Link
                  key={index}
                  href={`/category/${category.uid}`}
                  passHref={true}
                >
                  <a className="product-info__category-link">
                    {category.name[app.translator.locale]
                      ? category.name[app.translator.locale]
                      : category.name[Object.keys(category.name)[0]]}
                  </a>
                </Link>
              ))}
          </div>
        ) : null}
        {app.user && app.user.isAdmin ? (
          <div className="d-flex justify-content-end">
            <Link href={`/admin/product/${props.product.uid}`} passHref={true}>
              <a className="btn btn-primary d-flex align-items-center justify-content-center">
                <i className="fe fe-pen-tool" />
              </a>
            </Link>
          </div>
        ) : null}
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
        {Object.keys(productAttributeNames).length > 0 ? (
          <div className="product-info__product-attributes">
            {Object.keys(productAttributeNames).map((attributeId, index) => (
              <FormField
                key={index}
                form=""
                field=""
                type="select"
                value={selectedAttributes[attributeId]}
                setValue={(value) => {
                  setSelectedAttributes((selectedAttributes) => ({
                    ...selectedAttributes,
                    [attributeId]: value,
                  }));
                }}
                selectOptions={Object.keys(
                  productAttributesOptionNames[attributeId]
                ).map((optionId) => ({
                  label: productAttributesOptionNames[attributeId][optionId],
                  value: optionId,
                }))}
                label={productAttributeNames[attributeId]}
              />
            ))}
          </div>
        ) : null}
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
        <div className="d-flex gap-5 align-items-center justify-content-start">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1"
            onClick={addToCart}
          >
            {app.translator.t('components.productInfo.addToCart')}{' '}
            <span className="fe fe-shopping-cart"></span>
          </button>
          <button
            className={`btn btn-${isProductVariationAddedToWishlist ? 'primary' : 'outline-primary'} btn-rounded-circle`}
            onClick={addOrRemoveFromWishlist}
          >
            <i className="fe fe-bookmark" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
