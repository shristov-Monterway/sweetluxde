import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface PageLoadingProps extends AbstractComponentType {
  isAppLoading: boolean;
}

const PageLoading = (props: PageLoadingProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`page-loading ${props.isAppLoading ? 'page-loading--active' : ''}`}
    >
      <div className="page-loading__dots">
        <div className="spinner-grow text-primary" role="status" />
        <div className="spinner-grow text-primary" role="status" />
        <div className="spinner-grow text-primary" role="status" />
      </div>
      <span className="page-loading__label">
        {app.translator.t('components.pageLoading.label')}
      </span>
    </div>
  );
};

export default PageLoading;
