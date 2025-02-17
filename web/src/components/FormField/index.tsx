import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FormFieldErrors from '../FormFieldErrors';

export type FormFieldType =
  | 'email'
  | 'password'
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox';

export interface FormFieldOptionType {
  label: string;
  value: string;
  help?: string;
  disabled?: boolean;
}

export interface FormFieldProps extends AbstractComponentType {
  form: string;
  field: string;
  type: FormFieldType;
  value: string;
  setValue: (value: string) => void;
  selectOptions?: FormFieldOptionType[];
  label?: string;
  help?: string;
  labelTranslationParams?: {
    [key: string]: string;
  };
  helpTranslationParams?: {
    [key: string]: string;
  };
  inputAttributes?: { [key: string]: string };
  inputClassName?: string;
  disabled?: boolean;
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

  React.useEffect(() => {
    if (
      props.type === 'select' &&
      props.value === '' &&
      props.selectOptions &&
      props.selectOptions.length > 0
    ) {
      props.setValue(props.selectOptions[0].value);
    }
  }, [props.type, props.value]);

  let label: string | null = null;
  if (props.label) {
    label = props.label;
  } else {
    if (
      app.translator.t(`form.${props.form}.${props.field}.label`, {
        defaultValue: '------',
      }) !== '------'
    ) {
      label = app.translator.t(
        `form.${props.form}.${props.field}.label`,
        props.labelTranslationParams
      );
    }
  }

  let help: string | null = null;
  if (props.help) {
    help = props.help;
  } else {
    if (
      app.translator.t(`form.${props.form}.${props.field}.help`, {
        defaultValue: '------',
      }) !== '------'
    ) {
      help = app.translator.t(
        `form.${props.form}.${props.field}.help`,
        props.labelTranslationParams
      );
    }
  }

  let inputElement: React.JSX.Element;

  if (props.type === 'select') {
    inputElement = (
      <select
        className={`form-select ${props.inputClassName ? props.inputClassName : ''} ${formErrors.length > 0 ? 'is-invalid' : ''}`}
        id={`${props.form}-${props.field}`}
        aria-label={label ? label : `${props.form}_${props.field}`}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          if (props.disabled) {
            return;
          }
          props.setValue(event.target.value);
        }}
        disabled={props.disabled}
        {...(props.inputAttributes ? props.inputAttributes : {})}
      >
        {props.selectOptions?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (props.type === 'textarea') {
    inputElement = (
      <textarea
        className={`form-control ${props.inputClassName ? props.inputClassName : ''} ${formErrors.length > 0 ? 'is-invalid' : ''}`}
        id={`${props.form}-${props.field}`}
        aria-describedby={label ? label : undefined}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (props.disabled) {
            return;
          }
          props.setValue(event.target.value);
        }}
        disabled={props.disabled}
        {...(props.inputAttributes ? props.inputAttributes : {})}
      />
    );
  } else if (props.type === 'checkbox') {
    inputElement = (
      <div>
        {props.selectOptions?.map((option, index) => (
          <div key={index} className="form-check">
            <input
              className={`form-check-input ${props.inputClassName ? props.inputClassName : ''} ${formErrors.length > 0 ? 'is-invalid' : ''}`}
              type="checkbox"
              id={`${props.form}-${props.field}-${option.value}`}
              checked={option.value === props.value}
              onChange={() => {
                if (option.disabled) {
                  return;
                }
                if (option.value === props.value) {
                  props.setValue('');
                } else {
                  props.setValue(option.value);
                }
              }}
              disabled={option.disabled}
            />
            <label
              className="form-check-label"
              htmlFor={`${props.form}-${props.field}-${option.value}`}
            >
              {option.label}
            </label>
            {option.help ? (
              <div
                id={`${props.form}-${props.field}-${option.value}-help`}
                className="form-text"
              >
                {option.help}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  } else {
    inputElement = (
      <input
        className={`form-control ${props.inputClassName ? props.inputClassName : ''} ${formErrors.length > 0 ? 'is-invalid' : ''}`}
        id={`${props.form}-${props.field}`}
        type={props.type}
        aria-describedby={label ? label : undefined}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (props.disabled) {
            return;
          }
          props.setValue(event.target.value);
        }}
        disabled={props.disabled}
        {...(props.inputAttributes ? props.inputAttributes : {})}
      />
    );
  }

  return (
    <div className={`${props.className ? props.className : ''}`}>
      {label ? (
        <label htmlFor={`${props.form}-${props.field}`} className="form-label">
          {label}
        </label>
      ) : null}
      {inputElement}
      {help ? (
        <div id={`${props.form}-${props.field}-help`} className="form-text">
          {help}
        </div>
      ) : null}
      {formErrors.length > 0 ? (
        <FormFieldErrors formErrors={formErrors} />
      ) : null}
    </div>
  );
};

export default FormField;
