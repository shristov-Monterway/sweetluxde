import React from 'react';
import useApp from '../src/hooks/useApp';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import Slider from '../src/components/Slider';
import Banner from '../src/components/Banner';
import ProductCard from '../src/components/ProductCard';
import ProductsList from '../src/components/ProductsList';

const Index = (): React.JSX.Element => {
  const app = useApp();

  return (
    <Page isFluid={true} header={<Header hasShadow={true} />}>
      <Slider
        config={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
        }}
      >
        <Banner
          backgroundImage={{
            src: 'https://www.panelisimo-bg.com/_next/image?url=%2Fimages%2Fgallery%2Flivingroom1.jpg&w=3840&q=75',
          }}
          box={{
            title: {
              content: 'Welcome pepiii',
              size: 3,
            },
            description: {
              content: 'Test description',
            },
            links: [
              {
                content: 'Components',
                href: '/components',
                type: 'secondary',
              },
              {
                content: 'Cart',
                href: '/cart',
              },
              {
                content: 'Panelisimo',
                href: 'https://www.panelisimo-bg.com/',
              },
            ],
            position: 'center-left',
          }}
          size="lg"
        />
        <Banner
          backgroundImage={{
            src: 'https://www.panelisimo-bg.com/_next/image?url=%2Fimages%2Fgallery%2Flivingroom2.jpg&w=3840&q=75',
          }}
          box={{
            title: {
              content: 'Welcome pepiii',
              size: 3,
            },
            description: {
              content: 'Test description',
            },
            links: [
              {
                content: 'Components',
                href: '/components',
                type: 'secondary',
              },
              {
                content: 'Cart',
                href: '/cart',
              },
            ],
            position: 'center-left',
          }}
          size="lg"
        />
        <Banner
          backgroundImage={{
            src: 'https://www.panelisimo-bg.com/_next/image?url=%2Fimages%2Fgallery%2Flivingroom3.jpg&w=3840&q=75',
          }}
          box={{
            title: {
              content: 'Welcome pepiii',
              size: 3,
            },
            description: {
              content: 'Test description',
            },
            links: [
              {
                content: 'Components',
                href: '/components',
                type: 'secondary',
              },
              {
                content: 'Cart',
                href: '/cart',
              },
            ],
            position: 'center-left',
          }}
          size="lg"
        />
      </Slider>
      <hr className="my-5" />
      <div className="container">
        <ProductsList showFilters={true} />
      </div>
    </Page>
  );
};

export default Index;
