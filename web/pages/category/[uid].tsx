import React from 'react';
import useApp from '../../src/hooks/useApp';
import { useRouter } from 'next/router';
import Page from '../../src/components/Page';
import { NextSeo } from 'next-seo';
import NotFound from 'next/error';
import Header from '../../src/components/Header';
import CategorySection from '../../src/components/CategorySection';

const Category = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const uid = router.query.uid as string;

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
      <CategorySection category={category} />
    </Page>
  );
};

export default Category;
