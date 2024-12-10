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
      className={`btn btn-primary btn-sm ${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('authModal')}
    >
      {props.label ? props.label : <i className="fe fe-user" />}
    </button>
  );
};

export default AuthModalToggle;
