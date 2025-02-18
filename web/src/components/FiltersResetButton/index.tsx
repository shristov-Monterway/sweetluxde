import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export type FiltersResetButtonProps = AbstractComponentType;

const FiltersResetButton = (
  props: FiltersResetButtonProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={() => app.filters.reset()}
    >
      {app.translator.t('components.filtersResetButton.label')}
    </button>
  );
};

export default FiltersResetButton;
