import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface FiltersResetButtonProps extends AbstractComponentType {
  resetFilters: () => void;
}

const FiltersResetButton = (
  props: FiltersResetButtonProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={() => props.resetFilters()}
    >
      {app.translator.t('components.filtersResetButton.label')}
    </button>
  );
};

export default FiltersResetButton;
