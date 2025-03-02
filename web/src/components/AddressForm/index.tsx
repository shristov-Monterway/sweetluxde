import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import { AddressType } from '../../../../types/internal/AddressType';
import FormField from '../FormField';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';

export interface AddressFormProps extends AbstractComponentType {
  address?: AddressType;
  addressIndex?: number;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

const AddressForm = (props: AddressFormProps): React.JSX.Element => {
  const id = 'address';
  const app = useApp();
  const [address, setAddress] = React.useState<AddressType>({
    street: '',
    streetNumber: '',
    city: '',
    postalCode: '',
    country: '',
    name: '',
    phone: '',
  });

  React.useEffect(() => {
    if (
      typeof props.addressIndex === 'number' &&
      props.addressIndex > -1 &&
      props.address
    ) {
      setAddress(props.address);
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!app.user) {
      return;
    }

    const newAddresses = app.user.addresses;

    if (
      typeof props.addressIndex === 'number' &&
      props.addressIndex > -1 &&
      props.address
    ) {
      newAddresses[props.addressIndex] = address;
    } else {
      newAddresses.push(address);
    }

    FirestoreModule<UserType>()
      .writeDoc('users', app.user.uid, {
        ...app.user,
        addresses: newAddresses,
      })
      .then(() => {
        if (props.onSuccess) {
          props.onSuccess();
        }
      })
      .catch(() => {
        if (props.onFailure) {
          props.onFailure(new Error('Error creating new address.'));
        }
      });
  };

  return (
    <form
      className={`form address-form ${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    >
      <div className="address-form__row">
        <FormField
          form={id}
          field="street"
          type="text"
          value={address.street}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              street: value,
            }));
          }}
          className="address-form__col address-form__col--street"
        />
        <FormField
          form={id}
          field="streetNumber"
          type="text"
          value={address.streetNumber}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              streetNumber: value,
            }));
          }}
          className="address-form__col address-form__col--street-number"
        />
      </div>
      <div className="address-form__row">
        <FormField
          form={id}
          field="city"
          type="text"
          value={address.city}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              city: value,
            }));
          }}
          className="address-form__col"
        />
        <FormField
          form={id}
          field="postalCode"
          type="text"
          value={address.postalCode}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              postalCode: value,
            }));
          }}
          className="address-form__col"
        />
      </div>
      <div className="address-form__row">
        <FormField
          form={id}
          field="country"
          type="text"
          value={address.country}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              country: value,
            }));
          }}
          className="address-form__col"
        />
      </div>
      <div className="address-form__row">
        <FormField
          form={id}
          field="name"
          type="text"
          value={address.name}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              name: value,
            }));
          }}
          className="address-form__col"
        />
        <FormField
          form={id}
          field="phone"
          type="text"
          value={address.phone}
          setValue={(value) => {
            setAddress((address) => ({
              ...address,
              phone: value,
            }));
          }}
          className="address-form__col"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {app.translator.t(`form.submit.${id}`)}
      </button>
    </form>
  );
};

export default AddressForm;
