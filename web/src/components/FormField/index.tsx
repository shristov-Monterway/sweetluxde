import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FormFieldErrors from '../FormFieldErrors';

export interface FormFieldProps extends AbstractComponentType {
  form: string;
  field: string;
  type: 'email' | 'password' | 'text';
  value: string;
  setValue: (value: string) => void;
}

const FormField = (props: FormFieldProps): React.JSX.Element | null => {
  const app = useApp();
  const formErrors = app.formErrors.get
    .filter(
      (formError) =>
        formError.form === props.form && formError.field === props.field
    )
    .map((formError) => ({
      ...formError,
      error: app.translator.t(`errors.${formError.error}`, {
        defaultValue: formError.error,
      }),
    }));

  return (
    <>
      <label htmlFor={`${props.form}-${props.field}`} className="form-label">
        {app.translator.t(`form.${props.form}.${props.field}.label`)}
      </label>
      <input
        className={`form-control ${formErrors.length > 0 ? 'is-invalid' : ''}`}
        id={`${props.form}-${props.field}`}
        type={props.type}
        aria-describedby={`${props.form}-${props.field}-help`}
        value={props.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setValue(e.target.value)
        }
      />
      <div id={`${props.form}-${props.field}-help`} className="form-text">
        {app.translator.t(`form.${props.form}.${props.field}.help`)}
      </div>
      {formErrors.length > 0 ? (
        <FormFieldErrors formErrors={formErrors} />
      ) : null}
    </>
  );
};

export default FormField;
