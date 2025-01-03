import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface ExpandableProps extends AbstractComponentType {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  elements: {
    id: string;
    label: React.JSX.Element | React.JSX.Element[] | string;
    children: React.JSX.Element | React.JSX.Element[];
    help?: string;
  }[];
  labelClassName?: string;
  itemClassName?: string;
}

const Expandable = (props: ExpandableProps): React.JSX.Element => {
  return (
    <div className={`expandable ${props.className ? props.className : ''}`}>
      {props.elements.map((element, index) => (
        <div key={index}>
          <div
            className={`expandable__label ${props.labelClassName ? props.labelClassName : ''}`}
            onClick={() =>
              props.setValue(
                props.value === element.id ? undefined : element.id
              )
            }
          >
            <span>{element.label}</span>
            {element.help ? <small>{element.help}</small> : null}
          </div>
          <div
            className={`expandable__item ${props.value === element.id ? `expandable__item--active ${props.itemClassName ? props.itemClassName : ''}` : ''}`}
          >
            {element.children}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Expandable;
