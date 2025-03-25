import React from 'react';
import { FormErrorsContextType } from '../contexts/AppContext';
import { FormErrorType } from '../types/FormErrorType';

const useInitFormErrors = (): FormErrorsContextType => {
  const [formErrors, setFormErrors] = React.useState<FormErrorType[]>([]);

  return {
    get: formErrors,
    set: setFormErrors,
  };
};

export default useInitFormErrors;
