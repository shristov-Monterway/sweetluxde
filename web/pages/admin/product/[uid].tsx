import React from 'react';
import useApp from '../../../src/hooks/useApp';
import { useRouter } from 'next/router';
import Page from '../../../src/components/Page';
import { NextSeo } from 'next-seo';
import NotFound from 'next/error';
import Header from '../../../src/components/Header';
import ProductForm from '../../../src/components/ProductForm';

const AdminProduct = (): React.JSX.Element => {
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
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <NextSeo
        title={app.translator.t(`pages.${router.pathname}.title`, {
          name,
        })}
      />
      <ProductForm product={product} />
    </Page>
  );
};

export default AdminProduct;
