import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface LocaleModalToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const LocaleModalToggle = (
  props: LocaleModalToggleProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`btn btn-primary btn-sm ${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('localeModal')}
    >
      {props.label ? props.label : <i className="fe fe-globe" />}
    </button>
  );
};

export default LocaleModalToggle;
