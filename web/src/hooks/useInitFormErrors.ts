import React from 'react';
import { FormErrorsContextType } from '../contexts/AppContext';
import { FormError } from '../types/FormError';

const useInitFormErrors = (): FormErrorsContextType => {
  const [formErrors, setFormErrors] = React.useState<FormError[]>([]);

  return {
    get: formErrors,
    set: setFormErrors,
  };
};

export default useInitFormErrors;
