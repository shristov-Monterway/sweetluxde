import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AuthModal from '../AuthModal';
import LocaleModal from '../LocaleModal';
import FiltersModal from '../FiltersModal';

export interface PageProps extends AbstractComponentType {
  children: React.JSX.Element | React.JSX.Element[];
  isFluid?: boolean;
  header?: React.JSX.Element;
}

const Page = (props: PageProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div className={`page ${props.className ? props.className : ''}`}>
      {props.header ? <div className="page__header">{props.header}</div> : null}
      <div
        className="page__body"
        style={{
          paddingTop: `${app.config.headerHeight + 10}px`,
          paddingBottom: `${app.config.headerHeight + 10}px`,
        }}
      >
        <div className={props.isFluid ? 'container-fluid' : 'container'}>
          {props.children}
        </div>
      </div>
      <AuthModal showModal={app.activeModal.get === 'authModal'} />
      <LocaleModal showModal={app.activeModal.get === 'localeModal'} />
      <FiltersModal showModal={app.activeModal.get === 'filtersModal'} />
    </div>
  );
};

export default Page;
