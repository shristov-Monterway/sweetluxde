import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Section from '../Section';
import { ProductType } from '../../../../types/internal/ProductType';
import useApp from '../../hooks/useApp';
import ProductCard from '../ProductCard';

export interface SuggestedCategoryProductsProps extends AbstractComponentType {
  product: ProductType;
}

const SuggestedCategoryProducts = (
  props: SuggestedCategoryProductsProps
): React.JSX.Element | null => {
  const app = useApp();
  const [products, setProducts] = React.useState<ProductType[]>([
    props.product,
  ]);

  React.useEffect(() => {
    let newProducts: ProductType[] = [];
    props.product.categoryUids.forEach((categoryUid) => {
      const products = app.products.get.filter((product) =>
        product.categoryUids.includes(categoryUid)
      );
      newProducts.push(...products);
    });
    newProducts = newProducts.filter(
      (product) => product.uid !== props.product.uid
    );
    setProducts(newProducts);
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <Section
      title={app.translator.t('components.suggestedCategoryProducts.label')}
      className={`suggested-category-products ${props.className ? props.className : ''}`}
    >
      {products.map((product, index) => (
        <div key={index} className="suggested-category-products__item">
          <ProductCard product={product} />
        </div>
      ))}
    </Section>
  );
};

export default SuggestedCategoryProducts;
