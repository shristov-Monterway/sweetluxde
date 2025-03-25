import React from 'react';
import useApp from '../../src/hooks/useApp';
import { useRouter } from 'next/router';
import Page from '../../src/components/Page';
import { NextSeo } from 'next-seo';
import NotFound from 'next/error';
import ProductInfo from '../../src/components/ProductInfo';
import Header from '../../src/components/Header';
import SuggestedCategoryProducts from '../../src/components/SuggestedCategoryProducts';

const Product = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const uid = router.query.uid as string;

  const product = app.products.get.find((product) => product.uid === uid);

  if (!product) {
    return <NotFound statusCode={404} />;
  }

  const name = product.name[app.translator.locale]
    ? product.name[app.translator.locale]
    : product.name[Object.keys(product.name)[0]];

  return (
    <Page isFluid={false} header={<Header />}>
      <NextSeo
        title={app.translator.t(`pages.${router.pathname}.title`, {
          name,
        })}
      />
      <div className="d-flex flex-column gap-5">
        <ProductInfo product={product} />
        <SuggestedCategoryProducts product={product} />
      </div>
    </Page>
  );
};

export default Product;
