import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import Price from '../Price';

export interface ProductCardProps extends AbstractComponentType {
  product: ProductType;
}

const ProductCard = (props: ProductCardProps): React.JSX.Element | null => {
  const app = useApp();
  const locale = app.translator.locale;
  const haveProductVariationsSamePrice =
    Object.keys(props.product.variations)
      .map((uid) => props.product.variations[uid].price)
      .reduce((sum, a) => sum + a, 0) /
      props.product.variations[Object.keys(props.product.variations)[0]]
        .price ===
    Object.keys(props.product.variations).length;
  const lowestProductVariationPrice = Math.min(
    ...Object.keys(props.product.variations).map(
      (uid) => props.product.variations[uid].price
    )
  );
  const highestProductVariationPrice = Math.max(
    ...Object.keys(props.product.variations).map(
      (uid) => props.product.variations[uid].price
    )
  );

  return (
    <div className={`card ${props.className ? props.className : ''}`}>
      {props.product.image ? (
        <img src={props.product.image} alt="" className="card-img-top" />
      ) : null}
      <div className="card-body pb-0">
        <h2 className="card-title">
          {props.product.name[locale]
            ? props.product.name[locale]
            : props.product.name[Object.keys(props.product.name)[0]]}
        </h2>
        <p className="small text-body-secondary mb-3">
          {props.product.description[locale]}
        </p>
        {props.product.tags.length > 0 ? (
          <p className="d-flex gap-3">
            {props.product.tags.map((tag, index) => (
              <span key={index} className="badge bg-primary-subtle">
                {tag[locale] ? tag[locale] : tag[Object.keys(tag)[0]]}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      <div className="card-footer card-footer-boxed">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            {haveProductVariationsSamePrice ? (
              <Price
                prices={[
                  {
                    currency: app.currency.get,
                    value:
                      props.product.variations[
                        Object.keys(props.product.variations)[0]
                      ].price,
                  },
                ]}
              />
            ) : (
              <Price
                prices={[
                  {
                    currency: app.currency.get,
                    value: lowestProductVariationPrice,
                  },
                  {
                    currency: app.currency.get,
                    value: highestProductVariationPrice,
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
