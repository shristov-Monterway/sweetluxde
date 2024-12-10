import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import AuthForm from '../AuthForm';
import useApp from '../../hooks/useApp';
import WishlistProductCard from '../WishlistProductCard';
import { ProductType } from '../../../../types/internal/ProductType';

export type WishlistProductsListProps = AbstractComponentType;

const WishlistProductsList = (
  props: WishlistProductsListProps
): React.JSX.Element => {
  const app = useApp();
  const [lineItems, setLineItems] = React.useState<
    {
      product: ProductType;
      variationUid: string;
      quantity: number;
    }[]
  >([]);

  React.useEffect(() => {
    if (app.user) {
      setLineItems(
        app.user.wishlist.lineItems
          .filter((lineItem) => {
            const product = app.products.find(
              (product) => lineItem.product === product.uid
            );
            return product && product.variations[lineItem.variation];
          })
          .map((lineItem) => {
            const product = app.products.find(
              (product) => lineItem.product === product.uid
            );

            if (!product) {
              throw new Error('Product from wishlist is not found!');
            }

            const variation = product.variations[lineItem.variation];

            if (!variation) {
              throw new Error('Product variation from wishlist is not found!');
            }

            return {
              product,
              variationUid: lineItem.variation,
              quantity: lineItem.quantity,
            };
          })
      );
    }
  }, [app.user, app.products]);

  return (
    <div className={`${props.className ? props.className : ''}`}>
      {app.user ? (
        lineItems.length > 0 ? (
          <div className="row">
            {lineItems.map((lineItem, index) => (
              <div key={index} className="col-md-12">
                <WishlistProductCard
                  product={lineItem.product}
                  variationUid={lineItem.variationUid}
                  quantity={lineItem.quantity}
                />
              </div>
            ))}
          </div>
        ) : (
          <h1>
            {app.translator.t('components.wishlistProductsList.noProducts')}
          </h1>
        )
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default WishlistProductsList;
