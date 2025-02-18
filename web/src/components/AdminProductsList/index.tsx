import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export type AdminProductsListProps = AbstractComponentType;

const AdminProductsList = (
  props: AdminProductsListProps
): React.JSX.Element => {
  const app = useApp();
  const [productNames, setProductNames] = React.useState<{
    [id: string]: string;
  }>(
    app.products.reduce(
      (productNames, product) => ({
        ...productNames,
        [product.uid]: product.name[app.translator.locale]
          ? product.name[app.translator.locale]
          : product.name[Object.keys(product.name)[0]],
      }),
      {}
    )
  );

  React.useEffect(() => {
    const newProductNames = app.products.reduce(
      (productNames, product) => ({
        ...productNames,
        [product.uid]: product.name[app.translator.locale]
          ? product.name[app.translator.locale]
          : product.name[Object.keys(product.name)[0]],
      }),
      {}
    );
    setProductNames(newProductNames);
  }, [app.products]);

  return (
    <div
      className={`admin-products-list ${props.className ? props.className : ''}`}
    >
      <h1 className="admin-products-list__label">
        {app.translator.t('components.adminProductsList.label')}
      </h1>
      <div className="admin-products-list__container">
        {app.products.map((product, index) => (
          <div key={index} className="admin-products-list__product">
            <div className="admin-products-list__product-name-container">
              <span className="admin-products-list__product-name">
                {productNames[product.uid]}
              </span>
              <small>ID: {product.uid}</small>
            </div>
            <div className="admin-products-list__product-actions">
              <Link href={`/admin/product/${product.uid}`} passHref={true}>
                <a className="btn btn-outline-primary">
                  <i className="fe fe-chevron-right" />
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsList;
