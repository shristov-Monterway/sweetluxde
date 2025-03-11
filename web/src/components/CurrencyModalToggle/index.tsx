import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface CurrencyModalToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const CurrencyModalToggle = (
  props: CurrencyModalToggleProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={() => app.activeModal.set('currencyModal')}
    >
      {props.label ? props.label : <i className="fe fe-dollar-sign" />}
    </button>
  );
};

export default CurrencyModalToggle;
