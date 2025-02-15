import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface ExpandableElementType {
  id: string;
  label: React.JSX.Element | React.JSX.Element[] | string;
  children: React.JSX.Element | React.JSX.Element[];
  help?: string;
  showChevron?: boolean;
}

export interface ExpandableProps extends AbstractComponentType {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  elements: ExpandableElementType[];
  containerClassName?: string;
  labelClassName?: string;
  itemClassName?: string;
  canLabelExpand?: boolean;
}

const Expandable = (props: ExpandableProps): React.JSX.Element => {
  return (
    <div className={`expandable ${props.className ? props.className : ''}`}>
      {props.elements.map((element, index) => (
        <div
          key={index}
          className={`${props.containerClassName ? props.containerClassName : ''}`}
        >
          <div
            className={`expandable__button ${props.labelClassName ? props.labelClassName : ''}`}
          >
            <div
              className={`expandable__label ${props.canLabelExpand ? 'expandable__label--can-expand' : ''}`}
              onClick={() => {
                if (props.canLabelExpand) {
                  props.setValue(
                    props.value === element.id ? undefined : element.id
                  );
                }
              }}
            >
              <span>{element.label}</span>
              {element.help ? <small>{element.help}</small> : null}
            </div>
            {element.showChevron ? (
              <i
                className={`expandable__chevron-icon fe ${props.value === element.id ? 'fe-chevron-up' : 'fe-chevron-down'}`}
                onClick={() =>
                  props.setValue(
                    props.value === element.id ? undefined : element.id
                  )
                }
              />
            ) : null}
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
