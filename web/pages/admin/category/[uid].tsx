import React from 'react';
import useApp from '../../../src/hooks/useApp';
import { useRouter } from 'next/router';
import Page from '../../../src/components/Page';
import { NextSeo } from 'next-seo';
import NotFound from 'next/error';
import Header from '../../../src/components/Header';
import CategoryForm from '../../../src/components/CategoryForm';

const AdminCategory = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const uid = router.query.uid as string;

  if (!app.user || !app.user.isAdmin) {
    return <NotFound statusCode={404} />;
  }

  const category = app.categories.get.find((category) => category.uid === uid);

  if (!category) {
    return <NotFound statusCode={404} />;
  }

  const name = category.name[app.translator.locale]
    ? category.name[app.translator.locale]
    : category.name[Object.keys(category.name)[0]];

  return (
    <Page isFluid={false} header={<Header />}>
      <NextSeo
        title={app.translator.t(`pages.${router.pathname}.title`, {
          name,
        })}
      />
      <CategoryForm
        category={category}
        onSuccess={(category) => {
          app.categories.refresh().then(() => {
            router.push(`/category/${category.uid}`);
          });
        }}
      />
    </Page>
  );
};

export default AdminCategory;
