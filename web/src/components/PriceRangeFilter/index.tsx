import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import RangeSlider from '../RangeSlider';
import Price from '../Price';
import { FilterType } from '../../../../types/internal/FilterType';

export interface PriceRangeFilterProps extends AbstractComponentType {
  filters: FilterType;
  setFilters: (
    newFilters: FilterType | ((filters: FilterType) => FilterType)
  ) => void;
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
          minValue={props.filters.price.min}
          setMinValue={(newMinValue) => {
            props.setFilters((filters) => ({
              ...filters,
              price: {
                ...filters.price,
                min: newMinValue,
              },
            }));
          }}
          maxValue={props.filters.price.max}
          setMaxValue={(newMaxValue) => {
            props.setFilters((filters) => ({
              ...filters,
              price: {
                ...filters.price,
                max: newMaxValue,
              },
            }));
          }}
          min={props.filters.price.minRange}
          max={props.filters.price.maxRange}
          step={1}
          minValueOutput={
            <Price
              prices={[
                {
                  value: props.filters.price.min,
                  currency: app.currency.get,
                },
              ]}
            />
          }
          maxValueOutput={
            <Price
              prices={[
                {
                  value: props.filters.price.max,
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
