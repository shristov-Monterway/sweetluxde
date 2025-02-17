import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FormField from '../FormField';
import { FilterSortValueType } from '../../../../types/internal/FilterType';

export type SortFilterFormProps = AbstractComponentType;

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
      value={app.filters.get.sort}
      setValue={(value) => {
        app.filters.set((filters) => ({
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
