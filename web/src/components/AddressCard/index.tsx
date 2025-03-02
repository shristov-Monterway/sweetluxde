import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { AddressType } from '../../../../types/internal/AddressType';

export interface AddressCardProps extends AbstractComponentType {
  address: AddressType;
  actions?: {
    label: string | React.JSX.Element;
    onClick: () => void;
    className?: string;
  }[];
}

const AddressCard = (props: AddressCardProps): React.JSX.Element => {
  return (
    <div className={`address-card ${props.className ? props.className : ''}`}>
      <div className="address-card__address-container">
        <div className="address-card__location">
          <span>
            {props.address.street} {props.address.streetNumber}
          </span>
          <span>
            {props.address.city} {props.address.postalCode}{' '}
            {props.address.country}
          </span>
        </div>
        <hr className="m-0 p-0" />
        <div className="address-card__contact">
          <span>{props.address.name}</span>
          <span>{props.address.phone}</span>
        </div>
      </div>
      {props.actions ? (
        <div className="address-card__actions">
          {props.actions.map((action, index) => (
            <button
              key={index}
              className={`address-card__action ${action.className ? action.className : ''}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AddressCard;
