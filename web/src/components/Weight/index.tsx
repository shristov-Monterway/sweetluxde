import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface WeightProps extends AbstractComponentType {
  weight: number;
  unit: 'gr' | 'kg';
}

const Weight = (props: WeightProps): React.JSX.Element => {
  const app = useApp();

  const fromMilligramsConversation: {
    [unit: string]: number;
  } = {
    gr: 0.001,
    kg: 0.000001,
  };

  return (
    <span className={`${props.className ? props.className : ''}`}>
      {app.translator.numberToCurrency(
        props.weight * fromMilligramsConversation[props.unit],
        {
          unit: app.translator.t(`components.weight.unit.${props.unit}`),
        }
      )}
    </span>
  );
};

export default Weight;
