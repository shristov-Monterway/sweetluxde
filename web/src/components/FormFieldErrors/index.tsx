import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { FormErrorType } from '../../types/FormErrorType';

export interface FormFieldErrorsProps extends AbstractComponentType {
  formErrors: FormErrorType[];
}

const FormFieldErrors = (
  props: FormFieldErrorsProps
): React.JSX.Element | null => {
  if (props.formErrors.length === 0) {
    return null;
  }

  return (
    <div className={`${props.className ? props.className : ''}`}>
      {props.formErrors.map((formError, index) => (
        <span key={index} className="d-block text-danger">
          {formError.error}
        </span>
      ))}
    </div>
  );
};

export default FormFieldErrors;
