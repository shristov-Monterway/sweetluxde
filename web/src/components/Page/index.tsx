import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface PageProps extends AbstractComponentType {
  children: React.JSX.Element | React.JSX.Element[];
  isFluid?: boolean;
}

const Page = (props: PageProps): React.JSX.Element => {
  return (
    <div className={`main-content ${props.className ? props.className : ''}`}>
      <div className={props.isFluid ? 'container-fluid' : 'container'}>
        <div className="py-1">{props.children}</div>
      </div>
    </div>
  );
};

export default Page;
