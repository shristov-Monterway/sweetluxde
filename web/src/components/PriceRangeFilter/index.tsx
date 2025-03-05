import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import RangeSlider from '../RangeSlider';
import Price from '../Price';

export interface PriceRangeFilterProps extends AbstractComponentType {
  containerClassName?: string;
}

const PriceRangeFilter = (props: PriceRangeFilterProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`price-range-filter ${props.className ? props.className : ''}`}
    >
      <h3 className="p-0 m-0">
        {app.translator.t('components.priceRangeFilter.label')}
      </h3>
      <div
        className={`${props.containerClassName ? props.containerClassName : ''}`}
      >
        <RangeSlider
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
          minValueOutput={
            <Price
              prices={[
                {
                  value: app.filters.get.price.min,
                  currency: app.currency.get,
                },
              ]}
            />
          }
          maxValueOutput={
            <Price
              prices={[
                {
                  value: app.filters.get.price.max,
                  currency: app.currency.get,
                },
              ]}
            />
          }
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
