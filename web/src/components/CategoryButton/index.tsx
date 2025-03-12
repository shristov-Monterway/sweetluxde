import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import { CategoryType } from '../../../../types/internal/CategoryType';
import Link from 'next/link';

export interface CategoryButtonProps extends AbstractComponentType {
  category: CategoryType;
}

const CategoryButton = (props: CategoryButtonProps): React.JSX.Element => {
  const app = useApp();

  const name = props.category.name[app.translator.locale]
    ? props.category.name[app.translator.locale]
    : props.category.name[Object.keys(props.category.name)[0]];

  return (
    <Link href={`/category/${props.category.uid}`} passHref={true}>
      <a
        className={`category-button card card-body ${props.className ? props.className : ''}`}
      >
        {name}
      </a>
    </Link>
  );
};

export default CategoryButton;
