import React from 'react';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import Slider from '../src/components/Slider';
import Banner from '../src/components/Banner';

const Index = (): React.JSX.Element => {
  return (
    <Page isFluid={true} header={<Header />}>
      <Banner
        backgroundImage={{
          src: 'https://www.panelisimo-bg.com/_next/image?url=%2Fimages%2Fgallery%2Flivingroom1.jpg&w=3840&q=75',
        }}
        size="lg"
        box={{
          title: {
            content: 'Welcome pepiii',
          },
          description: {
            content: 'Test description',
          },
          links: [
            {
              content: 'Components',
              href: '/components',
            },
            {
              content: 'Cart',
              href: '/cart',
            },
          ],
          position: 'center-left',
          isRounded: true,
        }}
      />
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
            ],
            position: 'center-left',
          }}
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
        />
      </Slider>
    </Page>
  );
};

export default Index;
