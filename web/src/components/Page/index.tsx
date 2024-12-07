import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface PageProps extends AbstractComponentType {
  children: React.JSX.Element | React.JSX.Element[];
  isFluid?: boolean;
  header?: React.JSX.Element;
}

const Page = (props: PageProps): React.JSX.Element => {
  return (
    <div className={`page ${props.className ? props.className : ''}`}>
      {props.header ? <div className="page__header">{props.header}</div> : null}
      <div className="page__body">
        <div className={props.isFluid ? 'container-fluid' : 'container'}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Page;
