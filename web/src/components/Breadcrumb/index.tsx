import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Link from 'next/link';

export interface BreadcrumbProps extends AbstractComponentType {
  links: {
    label: string;
    url?: string;
  }[];
}

const Breadcrumb = (props: BreadcrumbProps): React.JSX.Element => {
  return (
    <ol className={`breadcrumb ${props.className ? props.className : ''}`}>
      {props.links.map((link, index) => (
        <li key={index} className="breadcrumb__item">
          {link.url ? (
            <Link href={link.url} passHref={true}>
              <a className="breadcrumb__link">{link.label}</a>
            </Link>
          ) : (
            <span className="breadcrumb__label">{link.label}</span>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Breadcrumb;
