import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import RangeSlider from '../RangeSlider/RangeSlider';
import Price from '../Price';

export interface PriceRangeFilterProps extends AbstractComponentType {}

const PriceRangeFilter = (props: PriceRangeFilterProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div className="price-range-filter">
      <RangeSlider
        className={`${props.className ? props.className : ''}`}
        minValue={app.filters.get.price.min}
        setMinValue={(newMinValue) => {
          app.filters.set((filters) => ({
            ...filters,
            price: {
              ...filters.price,
              min: newMinValue,
            },
          }));
        }}
        maxValue={app.filters.get.price.max}
        setMaxValue={(newMaxValue) => {
          app.filters.set((filters) => ({
            ...filters,
            price: {
              ...filters.price,
              max: newMaxValue,
            },
          }));
        }}
        min={app.filters.get.price.minRange}
        max={app.filters.get.price.maxRange}
        step={1}
      />
      <div className="price-range-filter_values">
        <div>
          <Price
            prices={[
              {
                value: app.filters.get.price.min,
                currency: app.currency.get,
              },
            ]}
          />
        </div>
        <div>
          <Price
            prices={[
              {
                value: app.filters.get.price.max,
                currency: app.currency.get,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
