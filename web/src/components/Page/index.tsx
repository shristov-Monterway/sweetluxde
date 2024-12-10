import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AuthModal from '../AuthModal';

export interface PageProps extends AbstractComponentType {
  children: React.JSX.Element | React.JSX.Element[];
  isFluid?: boolean;
  header?: React.JSX.Element;
}

const Page = (props: PageProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div className={`page ${props.className ? props.className : ''}`}>
      {props.header ? (
        <div className="page__header mb-3">{props.header}</div>
      ) : null}
      <div className="page__body">
        <div className={props.isFluid ? 'container-fluid' : 'container'}>
          {props.children}
        </div>
      </div>
      <AuthModal showModal={app.activeModal.get === 'authModal'} />
    </div>
  );
};

export default Page;
