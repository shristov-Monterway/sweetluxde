import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export type AdminProductsListProps = AbstractComponentType;

const AdminProductsList = (
  props: AdminProductsListProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`admin-products-list ${props.className ? props.className : ''}`}
    >
      {app.products.map((product, index) => (
        <div key={index} className="admin-products-list__product">
          <div className="admin-products-list__product-name">{product.uid}</div>
          <div className="admin-products-list__product-actions">
            <Link href={`/admin/product/${product.uid}`} passHref={true}>
              <a className="btn btn-primary">
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
