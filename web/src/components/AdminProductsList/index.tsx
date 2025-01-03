import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export type AdminProductsListProps = AbstractComponentType;

const AdminProductsList = (
  props: AdminProductsListProps
): React.JSX.Element => {
  const app = useApp();
  const [selectedProductUid, setSelectedProductUid] = React.useState<
    undefined | string
  >(undefined);

  return (
    <div
      className={`admin-products-list ${props.className ? props.className : ''}`}
    >
      {app.products.map((product, index) => (
        <div key={index}>
          <div
            className="admin-products-list__product-link"
            onClick={() =>
              setSelectedProductUid(
                selectedProductUid === product.uid ? undefined : product.uid
              )
            }
          >
            {product.uid}
          </div>
          <div
            className={`admin-products-list__product-form ${selectedProductUid === product.uid ? 'admin-products-list__product-form--active' : ''}`}
          >
            <Link href={`/admin/product/${product.uid}`} passHref={true}>
              <a className="btn btn-outline-primary">
                <i className="fe fe-settings" />
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProductsList;
