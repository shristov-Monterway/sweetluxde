import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FormField from '../FormField';
import {
  FilterSortValueType,
  FilterType,
} from '../../../../types/internal/FilterType';

export interface SortFilterFormProps extends AbstractComponentType {
  filters: FilterType;
  setFilters: (
    newFilters: FilterType | ((filters: FilterType) => FilterType)
  ) => void;
}

const SortFilterForm = (props: SortFilterFormProps): React.JSX.Element => {
  const app = useApp();
  const sortingOptions: FilterSortValueType[] = [
    'price-asc',
    'price-desc',
    'publishedDate-asc',
    'publishedDate-desc',
  ];

  return (
    <FormField
      form="sortFilter"
      field="value"
      type="select"
      value={props.filters.sort}
      setValue={(value) => {
        props.setFilters((filters) => ({
          ...filters,
          sort: value as FilterSortValueType,
        }));
      }}
      selectOptions={sortingOptions.map((option) => ({
        label: app.translator.t(`form.sortFilter.value.option.${option}.label`),
        value: option,
      }))}
      inputClassName={`${props.className ? props.className : ''}`}
    />
  );
};

export default SortFilterForm;
