import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import CartProductCard from '../CartProductCard';
import { ProductType } from '../../../../types/internal/ProductType';

export type CartProductsListProps = AbstractComponentType;

const CartProductsList = (props: CartProductsListProps): React.JSX.Element => {
  const app = useApp();
  const [lineItems, setLineItems] = React.useState<
    {
      product: ProductType;
      variationUid: string;
      attributes: {
        [uid: string]: string;
      };
      quantity: number;
    }[]
  >([]);

  React.useEffect(() => {
    if (app.user) {
      setLineItems(
        app.user.cart.lineItems
          .filter((lineItem) => {
            const product = app.products.get.find(
              (product) => lineItem.product === product.uid
            );
            return product && product.variations[lineItem.variation];
          })
          .map((lineItem) => {
            const product = app.products.get.find(
              (product) => lineItem.product === product.uid
            );

            if (!product) {
              throw new Error('Product from cart is not found.');
            }

            const variation = product.variations[lineItem.variation];

            if (!variation) {
              throw new Error('Product variation from cart is not found.');
            }

            return {
              product,
              variationUid: lineItem.variation,
              attributes: lineItem.attributes,
              quantity: lineItem.quantity,
            };
          })
      );
    }
  }, [app.user, app.products.get]);

  return (
    <div
      className={`cart-products-list ${props.className ? props.className : ''}`}
    >
      {lineItems.length > 0 ? (
        <div className="row">
          {lineItems.map((lineItem, index) => (
            <div key={index} className="col-lg-12">
              <CartProductCard
                product={lineItem.product}
                variationUid={lineItem.variationUid}
                attributes={lineItem.attributes}
                quantity={lineItem.quantity}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="cart-products-list__empty-container">
          <hr className="flex-grow-1" />
          <span className="cart-products-list__empty-label">
            {app.translator.t('components.cartProductsList.noProducts')}
          </span>
          <hr className="flex-grow-1" />
        </div>
      )}
    </div>
  );
};

export default CartProductsList;
