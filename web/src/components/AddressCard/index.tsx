import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { AddressType } from '../../../../types/internal/AddressType';
import useApp from '../../hooks/useApp';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';

export interface AddressCardProps extends AbstractComponentType {
  address: AddressType;
  indexToDelete?: number;
  onSuccessDelete?: () => void;
  onFailureDelete?: (error: Error) => void;
}

const AddressCard = (props: AddressCardProps): React.JSX.Element => {
  const app = useApp();

  const onDelete = () => {
    if (!app.user) {
      return;
    }

    if (typeof props.indexToDelete !== 'undefined') {
      const newAddresses = app.user.addresses;
      newAddresses.splice(props.indexToDelete, 1);
      FirestoreModule<UserType>()
        .writeDoc('users', app.user.uid, {
          ...app.user,
          addresses: newAddresses,
        })
        .then(() => {
          if (props.onSuccessDelete) {
            props.onSuccessDelete();
          }
        })
        .catch(() => {
          if (props.onFailureDelete) {
            props.onFailureDelete(new Error('Error deleting address.'));
          }
        });
    }
  };

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
      {typeof props.indexToDelete !== 'undefined' ? (
        <div className="address-card__actions">
          {typeof props.indexToDelete !== 'undefined' ? (
            <button
              className="address-card__action btn btn-outline-danger"
              onClick={onDelete}
            >
              <i className="fe fe-trash" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AddressCard;
