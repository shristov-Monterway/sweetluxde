import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export type AdminCategoriesListProps = AbstractComponentType;

const AdminCategoriesList = (
  props: AdminCategoriesListProps
): React.JSX.Element => {
  const app = useApp();
  const [categoryNames, setCategoryNames] = React.useState<{
    [id: string]: string;
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

  React.useEffect(() => {
    const newCategoryNames = app.categories.get.reduce(
      (categoryNames, category) => ({
        ...categoryNames,
        [category.uid]: category.name[app.translator.locale]
          ? category.name[app.translator.locale]
          : category.name[Object.keys(category.name)[0]],
      }),
      {}
    );
    setCategoryNames(newCategoryNames);
  }, [app.categories.get]);

  return (
    <div
      className={`admin-categories-list ${props.className ? props.className : ''}`}
    >
      <h1 className="admin-categories-list__label">
        {app.translator.t('components.adminCategoriesList.label')}
      </h1>
      <div className="admin-categories-list__container">
        {app.categories.get.map((category, index) => (
          <div key={index} className="admin-categories-list__category">
            <div className="admin-categories-list__category-name-container">
              <span className="admin-categories-list__category-name">
                {categoryNames[category.uid]}
              </span>
              <small>ID: {category.uid}</small>
            </div>
            <div className="admin-categories-list__category-actions">
              <Link href={`/admin/category/${category.uid}`} passHref={true}>
                <a className="btn btn-outline-primary">
                  <i className="fe fe-chevron-right" />
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesList;
