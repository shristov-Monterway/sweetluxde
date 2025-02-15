import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import useApp from '../../hooks/useApp';
import { CategoryType } from '../../../../types/internal/CategoryType';
import Expandable, { ExpandableElementType } from '../Expandable';

export interface FiltersModalProps extends AbstractComponentType {
  showModal: boolean;
}

const FiltersModal = (props: FiltersModalProps): React.JSX.Element => {
  const app = useApp();
  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const [categoryNames, setCategoryNames] = React.useState<{
    [categoryId: string]: string;
  }>(
    app.categories.reduce(
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
    app.products.forEach((product) => {
      product.categoryUids.forEach((productCategoryUid) => {
        if (
          !categories
            .map((category) => category.uid)
            .includes(productCategoryUid)
        ) {
          const category = app.categories.find(
            (category) => category.uid === productCategoryUid
          );
          if (category) {
            categories.push(category);
          }
        }
      });
    });
    setCategories(categories);
  }, [app.products]);

  React.useEffect(() => {
    setCategoryNames(
      app.categories.reduce(
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
  } = calculateCategoryChildCount(app.categories);

  const buildCategoryExpandableElements = (
    categories: CategoryType[],
    parentUid: string | null = null,
    level: number = 0
  ): ExpandableElementType[] => {
    return categories
      .filter((category) => category.parentUid === parentUid)
      .map((category) => ({
        id: category.uid,
        label: categoryNames[category.uid],
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
    <Modal
      showModal={props.showModal}
      position="full-left"
      className={`${props.className ? props.className : ''}`}
    >
      <div className="d-flex flex-column gap-3">
        <hr />
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
        <hr />
      </div>
    </Modal>
  );
};

export default FiltersModal;
