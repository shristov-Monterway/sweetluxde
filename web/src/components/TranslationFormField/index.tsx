import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { useRouter } from 'next/router';
import * as localeCodes from 'locale-codes';
import FormField from '../FormField';

export interface TranslationFormFieldProps extends AbstractComponentType {
  form: string;
  field: string;
  translations: {
    [locale: string]: string;
  };
  setTranslations: (translations: { [locale: string]: string }) => void;
  type?: 'text' | 'textarea';
  inputAttributes?: { [key: string]: string };
  labelTranslationParams?: {
    [key: string]: string;
  };
  helpTranslationParams?: {
    [key: string]: string;
  };
}

const TranslationFormField = (
  props: TranslationFormFieldProps
): React.JSX.Element => {
  const router = useRouter();
  const locales = router.locales;
  const [newTranslationFormIsVisible, setNewTranslationFormIsVisible] =
    React.useState<boolean>(false);
  const [newTranslationLocale, setNewTranslationLocale] =
    React.useState<string>('');
  const [newTranslationValue, setNewTranslationValue] =
    React.useState<string>('');

  if (!locales || locales.length === 0) {
    throw new Error('No list with supported locales!');
  }

  const newTranslationLocaleOptions = locales
    .filter((locale) => !Object.keys(props.translations).includes(locale))
    .map((locale) => ({
      label: localeCodes.getByTag(locale).name,
      value: locale,
    }));

  React.useEffect(() => {
    if (newTranslationLocaleOptions.length === 0) {
      setNewTranslationFormIsVisible(false);
      setNewTranslationLocale('');
    } else {
      setNewTranslationFormIsVisible(true);
      setNewTranslationLocale(newTranslationLocaleOptions[0].value);
    }
  }, [newTranslationLocaleOptions]);

  return (
    <div
      className={`d-flex flex-column gap-3 ${props.className ? props.className : ''}`}
    >
      {Object.keys(props.translations).map((index) => (
        <div key={index} className="d-flex align-items-center gap-3">
          <FormField
            className="flex-grow-1"
            form={props.form}
            field={props.field}
            type={props.type ? props.type : 'text'}
            value={props.translations[index]}
            setValue={(newTranslationValue) => {
              props.setTranslations({
                ...props.translations,
                [index]: newTranslationValue,
              });
            }}
            labelTranslationParams={{
              language: localeCodes.getByTag(index).name,
              ...(props.labelTranslationParams
                ? props.labelTranslationParams
                : {}),
            }}
            helpTranslationParams={{
              language: localeCodes.getByTag(index).name,
              ...(props.helpTranslationParams
                ? props.helpTranslationParams
                : {}),
            }}
            inputAttributes={props.inputAttributes}
          />
          {Object.keys(props.translations).length > 1 ? (
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => {
                const newTranslations = props.translations;
                delete newTranslations[index];
                props.setTranslations(newTranslations);
              }}
            >
              <i className="fe fe-minus-circle" />
            </button>
          ) : null}
        </div>
      ))}
      {newTranslationFormIsVisible ? (
        <div className="d-flex align-items-center gap-3">
          <FormField
            className="flex-grow-1"
            form={props.form}
            field={`${props.field}_locale`}
            type="select"
            value={newTranslationLocale}
            setValue={(newTranslationLocale) =>
              setNewTranslationLocale(newTranslationLocale)
            }
            selectOptions={newTranslationLocaleOptions}
          />
          <FormField
            className="flex-grow-1"
            form={props.form}
            field={`${props.field}_value`}
            type={props.type ? props.type : 'text'}
            value={newTranslationValue}
            setValue={(newTranslationValue) =>
              setNewTranslationValue(newTranslationValue)
            }
            inputAttributes={props.inputAttributes}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              props.setTranslations({
                ...props.translations,
                [newTranslationLocale]: newTranslationValue,
              });
              setNewTranslationValue('');
            }}
            type="button"
          >
            <i className="fe fe-plus-circle" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TranslationFormField;
