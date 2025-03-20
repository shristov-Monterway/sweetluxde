import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { CategoryType } from '../../../../types/internal/CategoryType';
import Expandable, { ExpandableElementType } from '../Expandable';
import useApp from '../../hooks/useApp';
import { FilterType } from '../../../../types/internal/FilterType';

export interface CategoriesFilterProps extends AbstractComponentType {
  filters: FilterType;
  setFilters: (
    newFilters: FilterType | ((filters: FilterType) => FilterType)
  ) => void;
  containerClassName?: string;
}

const CategoriesFilter = (props: CategoriesFilterProps): React.JSX.Element => {
  const app = useApp();

  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const [categoryNames, setCategoryNames] = React.useState<{
    [categoryId: string]: string;
  }>(
    app.categories.get.reduce(
      (categoryNames, category) => ({
        ...categoryNames,
        [category.uid]: category.name[app.translator.locale]
          ? category.name[app.translator.locale]
          : category.name[Object.keys(category.name)[0]],
      }),
      {}
    )
  );
  const [expandedCategoryUids, setExpandedCategoryUids] = React.useState<{
    [level: number]: string | undefined;
  }>({
    0: undefined,
  });

  React.useEffect(() => {
    const categories: CategoryType[] = [];
    app.products.get.forEach((product) => {
      product.categoryUids.forEach((productCategoryUid) => {
        if (
          !categories
            .map((category) => category.uid)
            .includes(productCategoryUid)
        ) {
          const category = app.categories.get.find(
            (category) => category.uid === productCategoryUid
          );
          if (category) {
            categories.push(category);
          }
        }
      });
    });
    setCategories(categories);
  }, [app.products.get]);

  React.useEffect(() => {
    setCategoryNames(
      app.categories.get.reduce(
        (categoryNames, category) => ({
          ...categoryNames,
          [category.uid]: category.name[app.translator.locale]
            ? category.name[app.translator.locale]
            : category.name[Object.keys(category.name)[0]],
        }),
        {}
      )
    );
  }, [app.translator.locale, categories]);

  const calculateCategoryChildCount = (
    categories: CategoryType[],
    parentUid: string | null = null,
    childCount: {
      [categoryUid: string]: number;
    } = {}
  ): {
    [categoryUid: string]: number;
  } => {
    const children = categories.filter(
      (category) => category.parentUid === parentUid
    );
    childCount[parentUid || 'root'] = children.length;

    children.forEach((child) => {
      calculateCategoryChildCount(categories, child.uid, childCount);
    });

    return childCount;
  };

  const categoryChildCounts: {
    [categoryUid: string]: number;
  } = calculateCategoryChildCount(app.categories.get);

  const buildCategoryExpandableElements = (
    categories: CategoryType[],
    parentUid: string | null = null,
    level: number = 0
  ): ExpandableElementType[] => {
    return categories
      .filter((category) => category.parentUid === parentUid)
      .map((category) => ({
        id: category.uid,
        label: (
          <div
            className={`categories-filter__category-name ${props.filters.categories.includes(category.uid) ? 'categories-filter__category-name--active' : ''}`}
            onClick={() => {
              const newCategoriesFilter = props.filters.categories;
              if (props.filters.categories.includes(category.uid)) {
                const indexOfExistingCategoryInFilters =
                  props.filters.categories.indexOf(category.uid);
                if (indexOfExistingCategoryInFilters > -1) {
                  newCategoriesFilter.splice(
                    indexOfExistingCategoryInFilters,
                    1
                  );
                }
              } else {
                newCategoriesFilter.push(category.uid);
              }
              props.setFilters((filters) => ({
                ...filters,
                categories: newCategoriesFilter,
              }));
            }}
          >
            {props.filters.categories.includes(category.uid) ? (
              <i className="fe fe-check-circle h4 p-0 m-0" />
            ) : null}
            {categoryNames[category.uid]}
          </div>
        ),
        children: (
          <Expandable
            value={expandedCategoryUids[level + 1]}
            setValue={(value) => {
              setExpandedCategoryUids((expandedCategoryUids) => ({
                ...expandedCategoryUids,
                [level + 1]: value,
              }));
            }}
            elements={buildCategoryExpandableElements(
              categories,
              category.uid,
              level + 1
            )}
            className="d-flex flex-column"
            itemClassName="ps-4"
          />
        ),
        showChevron: categoryChildCounts[category.uid] > 0,
      }));
  };

  return (
    <div
      className={`categories-filter ${props.className ? props.className : ''}`}
    >
      <h3 className="p-0 m-0">
        {app.translator.t('components.categoriesFilter.label')}
      </h3>
      <div
        className={`${props.containerClassName ? props.containerClassName : ''}`}
      >
        <Expandable
          value={expandedCategoryUids[0]}
          setValue={(value) => {
            setExpandedCategoryUids((expandedCategoryUids) => ({
              ...expandedCategoryUids,
              0: value,
            }));
          }}
          elements={buildCategoryExpandableElements(categories)}
          className="d-flex flex-column"
          itemClassName="ps-4"
        />
      </div>
    </div>
  );
};

export default CategoriesFilter;
