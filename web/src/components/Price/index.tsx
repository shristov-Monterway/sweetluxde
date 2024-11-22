import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import getSymbolFromCurrency from 'currency-symbol-map';

export interface PriceProps extends AbstractComponentType {
  prices: {
    currency: string;
    value: number;
  }[];
}

const Price = (props: PriceProps): React.JSX.Element => {
  const app = useApp();

  return (
    <span className={`${props.className ? props.className : ''}`}>
      {props.prices
        .map((price) =>
          app?.translator.numberToCurrency(price.value / 100, {
            unit: getSymbolFromCurrency(price.currency)
              ? getSymbolFromCurrency(price.currency)
              : `${price.currency} `,
          })
        )
        .join(' - ')}
    </span>
  );
};

export default Price;
