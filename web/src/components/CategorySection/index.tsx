import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { CategoryType } from '../../../../types/internal/CategoryType';
import Section from '../Section';
import CategoryButton from '../CategoryButton';
import useApp from '../../hooks/useApp';
import ProductsList from '../ProductsList';

export interface CategorySectionProps extends AbstractComponentType {
  category: CategoryType;
}

const CategorySection = (props: CategorySectionProps): React.JSX.Element => {
  const app = useApp();

  const name = props.category.name[app.translator.locale]
    ? props.category.name[app.translator.locale]
    : props.category.name[Object.keys(props.category.name)[0]];

  const description = props.category.description[app.translator.locale]
    ? props.category.description[app.translator.locale]
    : props.category.description[Object.keys(props.category.description)[0]];

  const getParentCategories = (categoryUid: string): CategoryType[] => {
    const parentCategories: CategoryType[] = [];

    const findParents = (currentUid: string): void => {
      const currentCategory = app.categories.find(
        (category) => category.uid === currentUid
      );

      if (!currentCategory) {
        throw new Error('Category not found!');
      }

      if (currentCategory.parentUid) {
        findParents(currentCategory.parentUid);
      }

      parentCategories.push(currentCategory);
    };

    findParents(categoryUid);

    return parentCategories;
  };

  const parentCategories = getParentCategories(props.category.uid);
  const childCategories = app.categories.filter(
    (category) => category.parentUid === props.category.uid
  );

  return (
    <Section
      title={name}
      description={description}
      breadcrumbLink={parentCategories.map((category) => ({
        label: category.name[app.translator.locale]
          ? category.name[app.translator.locale]
          : category.name[Object.keys(category.name)[0]],
        url:
          category.uid === props.category.uid
            ? undefined
            : `/category/${category.uid}`,
      }))}
      headerContent={
        childCategories.length > 0 ? (
          <div className="category-section__header-actions">
            {childCategories.map((category, index) => (
              <div key={index}>
                <CategoryButton
                  className="category-section__header-action"
                  category={category}
                />
              </div>
            ))}
          </div>
        ) : null
      }
      className={`category-section ${props.className}`}
    >
      <ProductsList showFilters={true} showSorting={true} />
    </Section>
  );
};

export default CategorySection;
