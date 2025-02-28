import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { AddressType } from '../../../../types/internal/AddressType';
import useApp from '../../hooks/useApp';
import AddressCard from '../AddressCard';

export interface AddressesListProps extends AbstractComponentType {
  addresses: AddressType[];
  includeDeleteFunctionality: boolean;
}

const AddressesList = (props: AddressesListProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div className={`addresses-list ${props.className ? props.className : ''}`}>
      {props.addresses.length > 0 ? (
        <div className="addresses-list__list">
          {props.addresses.map((address, index) => (
            <div key={index}>
              <AddressCard
                address={address}
                indexToDelete={
                  props.includeDeleteFunctionality ? index : undefined
                }
                className="addresses-list__item"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="addresses-list__empty-container">
          <hr className="flex-grow-1" />
          <span className="addresses-list__empty-label">
            {app.translator.t('components.addressesList.noAddresses')}
          </span>
          <hr className="flex-grow-1" />
        </div>
      )}
    </div>
  );
};

export default AddressesList;
