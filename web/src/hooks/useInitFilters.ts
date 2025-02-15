import React from 'react';
import { FiltersContextType } from '../contexts/AppContext';

const useInitFilters = (): FiltersContextType => {
  const [filters, setFilters] = React.useState<{
    categories: string[];
  }>({
    categories: [],
  });

  return {
    get: filters,
    set: setFilters,
  };
};

export default useInitFilters;
