import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface AuthModalToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const AuthModalToggle = (props: AuthModalToggleProps): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`d-flex justify-content-center align-items-center gap-1 ${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('authModal')}
    >
      {app.translator.t('components.authModalToggle.label')}
      {props.label ? props.label : <i className="fe fe-log-in" />}
    </button>
  );
};

export default AuthModalToggle;
