import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import Price from '../Price';
import { useRouter } from 'next/router';

export interface ProductCardProps extends AbstractComponentType {
  product: ProductType;
}

const ProductCard = (props: ProductCardProps): React.JSX.Element | null => {
  const app = useApp();
  const router = useRouter();
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [tags, setTags] = React.useState<string[]>([]);

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

    setName(name);
    setDescription(description);
    setTags(tags);
  }, [app.translator.locale]);

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
    <div
      className={`card lift lift-lg ${props.className ? props.className : ''}`}
      onClick={() => router.push(`/product/${props.product.uid}`)}
    >
      {props.product.image ? (
        <img
          src={props.product.image}
          alt=""
          className="card-img-top product-card__image"
        />
      ) : null}
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="small text-body-secondary mb-3">{description}</p>
        {tags.length > 0 ? (
          <h3 className="d-flex gap-3 flex-wrap p-0 m-0">
            {tags.map((tag, index) => (
              <span key={index} className="badge bg-primary">
                {tag}
              </span>
            ))}
          </h3>
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
