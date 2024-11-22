import React from 'react';
import useApp from '../../src/hooks/useApp';
import { useRouter } from 'next/router';
import Page from '../../src/components/Page';
import { NextSeo } from 'next-seo';
import NotFound from 'next/error';
import ProductInfo from '../../src/components/ProductInfo';

const Product = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const uid = router.query.uid as string;

  const product = app.products.find((product) => product.uid === uid);

  if (!product) {
    return <NotFound statusCode={404} />;
  }

  const name = product.name[app.translator.locale]
    ? product.name[app.translator.locale]
    : product.name[Object.keys(product.name)[0]];

  return (
    <Page isFluid={false}>
      <NextSeo
        title={app.translator.t(`pages.${router.pathname}.title`, {
          name,
        })}
      />
      <ProductInfo product={product} />
    </Page>
  );
};

export default Product;
