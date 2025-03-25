import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface NavModalToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const NavModalToggle = (props: NavModalToggleProps): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('navModal')}
    >
      {props.label ? props.label : <i className="fe fe-menu" />}
    </button>
  );
};

export default NavModalToggle;
