import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface FiltersModalToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const FiltersModalToggle = (
  props: FiltersModalToggleProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`btn btn-primary btn-sm ${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('filtersModal')}
    >
      {props.label ? props.label : <i className="fe fe-filter" />}
    </button>
  );
};

export default FiltersModalToggle;
