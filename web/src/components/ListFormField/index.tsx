import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import TranslationFormField from '../TranslationFormField';
import { TranslationType } from '../../../../types/internal/TranslationType';
import FormField, { FormFieldOptionType, FormFieldType } from '../FormField';

export type ListFormFieldType =
  | Exclude<FormFieldType, 'checkbox'>
  | 'translation';

export interface ListFormFieldProps<T> extends AbstractComponentType {
  form: string;
  field: string;
  list: T[];
  setList: (list: T[]) => void;
  newItem: T;
  type: ListFormFieldType;
  selectOptions?: FormFieldOptionType[];
  inputAttributes?: { [key: string]: string };
  max?: number;
}

const ListFormField = <T,>(props: ListFormFieldProps<T>): React.JSX.Element => {
  const [newItem, setNewItem] = React.useState<T>(props.newItem);

  const newItemFormIsVisible =
    props.list.length < (props.max ? props.max : 100);

  const getListInput = (
    item: T,
    index: number,
    type: ListFormFieldType,
    selectOptions?: FormFieldOptionType[],
    inputAttributes?: { [key: string]: string },
    className?: string
  ): React.JSX.Element => {
    if (type !== 'translation') {
      return (
        <FormField
          className={className ? className : ''}
          form={props.form}
          field={props.field}
          type={type}
          value={item as string}
          setValue={(value) => {
            const newList = props.list;
            newList[index] = value as T;
            props.setList(newList);
          }}
          selectOptions={selectOptions ? selectOptions : []}
          labelTranslationParams={{
            count: (index + 1).toString(),
          }}
          helpTranslationParams={{
            count: (index + 1).toString(),
          }}
          inputAttributes={inputAttributes}
        />
      );
    } else {
      return (
        <TranslationFormField
          className={className ? className : ''}
          form={props.form}
          field={props.field}
          translations={item as TranslationType}
          setTranslations={(translations) => {
            const newList = props.list as TranslationType[];
            newList[index] = translations;
            props.setList(newList as T[]);
          }}
          labelTranslationParams={{
            count: (index + 1).toString(),
          }}
          helpTranslationParams={{
            count: (index + 1).toString(),
          }}
          inputAttributes={inputAttributes}
        />
      );
    }
  };

  const getNewInput = (
    item: T,
    type: ListFormFieldType,
    selectOptions?: FormFieldOptionType[],
    inputAttributes?: { [key: string]: string },
    className?: string
  ): React.JSX.Element => {
    if (type !== 'translation') {
      return (
        <FormField
          className={className ? className : ''}
          form={props.form}
          field={`${props.field}_new`}
          type={type}
          value={item as string}
          setValue={(value) => {
            setNewItem(value as T);
          }}
          selectOptions={selectOptions ? selectOptions : []}
          inputAttributes={inputAttributes}
        />
      );
    } else {
      return (
        <TranslationFormField
          className={className ? className : ''}
          form={props.form}
          field={`${props.field}_new`}
          translations={item as TranslationType}
          setTranslations={(translations) => {
            setNewItem(translations as T);
          }}
          inputAttributes={inputAttributes}
        />
      );
    }
  };

  return (
    <div
      className={`d-flex flex-column gap-3 ${props.className ? props.className : ''}`}
    >
      {props.list.map((item, index) => (
        <div key={index} className="d-flex align-items-center gap-3">
          {getListInput(
            item,
            index,
            props.type,
            props.selectOptions,
            props.inputAttributes,
            'flex-grow-1'
          )}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              const newList = props.list;
              newList.splice(index, 1);
              props.setList(newList);
            }}
          >
            <i className="fe fe-minus-circle" />
          </button>
        </div>
      ))}
      {newItemFormIsVisible ? (
        <>
          {props.list.length > 0 ? <hr /> : null}
          <div className="d-flex align-items-center gap-3">
            {getNewInput(
              newItem,
              props.type,
              props.selectOptions,
              props.inputAttributes,
              'flex-grow-1'
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                const newList = props.list;
                newList.push(newItem);
                props.setList(newList);
                setNewItem(props.newItem);
              }}
              type="button"
            >
              <i className="fe fe-plus-circle" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ListFormField;
