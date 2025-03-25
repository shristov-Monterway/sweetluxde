import {
  ProductBadgeType,
  ProductBadgeTypeType,
  ProductType,
} from '../../../../types/internal/ProductType';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { TranslationType } from '../../../../types/internal/TranslationType';
import { CategoryType } from '../../../../types/internal/CategoryType';

export interface FixtureModuleType {
  generateTranslation: (value: string, locales: string[]) => TranslationType;
  generateCategory: (parentUid: string | null) => CategoryType;
  generateProduct: (categoryUids: string[]) => ProductType;
}

const FixtureModule = (): FixtureModuleType => {
  const generateNumberFromTo = (from: number, to: number): number => {
    return Math.floor(Math.random() * (to - from) + from);
  };

  return {
    generateTranslation: (value, locales) => {
      return locales.reduce(
        (translations, locale) => ({
          ...translations,
          [locale]: `${value} ${locale.toUpperCase()}`,
        }),
        {}
      );
    },
    generateProduct: (categoryUids) => {
      const uid = uuidv4();
      const badgeTypes: ProductBadgeTypeType[] = [
        'success',
        'danger',
        'info',
        'warning',
      ];
      const badge: ProductBadgeType | null =
        generateNumberFromTo(2, 10) % 2 === 0
          ? {
              type: badgeTypes[Math.floor(Math.random() * badgeTypes.length)], // eslint-disable-line
              text: FixtureModule().generateTranslation('S', ['en', 'bg']), // eslint-disable-line
            } // eslint-disable-line
          : null;

      const product: ProductType = {
        uid,
        name: FixtureModule().generateTranslation(
          faker.commerce.productName(),
          ['en', 'bg']
        ),
        description: FixtureModule().generateTranslation(
          faker.commerce.productDescription(),
          ['en', 'bg']
        ),
        variations: [...Array(generateNumberFromTo(1, 3)).keys()].reduce(
          (variations, variationId) => ({
            ...variations,
            [variationId]: {
              name: FixtureModule().generateTranslation(
                faker.commerce.productName(),
                ['en', 'bg']
              ),
              description: FixtureModule().generateTranslation(
                faker.commerce.productDescription(),
                ['en', 'bg']
              ),
              images: [...Array(generateNumberFromTo(0, 7)).keys()].map(() =>
                faker.image.url()
              ),
              price: generateNumberFromTo(100, 20000),
              weight: [false, true][generateNumberFromTo(0, 2)]
                ? generateNumberFromTo(10000, 50000)
                : null,
              attributes: {
                size: {
                  name: FixtureModule().generateTranslation('Size', [
                    'en',
                    'bg',
                  ]),
                  options: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl']
                    .slice(0, generateNumberFromTo(1, 5))
                    .reduce(
                      (options, optionId) => ({
                        ...options,
                        [optionId]: {
                          name: FixtureModule().generateTranslation(optionId, [
                            'en',
                            'bg',
                          ]),
                        },
                      }),
                      {}
                    ),
                },
              },
            },
          }),
          {}
        ),
        tags: [...Array(generateNumberFromTo(0, 7)).keys()].map(() =>
          FixtureModule().generateTranslation(faker.food.fruit(), ['en', 'bg'])
        ),
        badge,
        categoryUids,
        publishedDate: Date.now(),
      };

      return product;
    },
    generateCategory: (parentUid: string | null) => {
      const uid = uuidv4();
      const category: CategoryType = {
        uid,
        name: FixtureModule().generateTranslation(
          faker.commerce.productName(),
          ['en', 'bg']
        ),
        description: FixtureModule().generateTranslation(
          faker.commerce.productDescription(),
          ['en', 'bg']
        ),
        parentUid: parentUid,
      };
      return category;
    },
  };
};

export default FixtureModule;
