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

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

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
      <ProductForm
        product={product}
        onSuccess={(product) => {
          app.products.refresh().then(() => {
            router.push(`/product/${product.uid}`);
          });
        }}
      />
    </Page>
  );
};

export default AdminProduct;
