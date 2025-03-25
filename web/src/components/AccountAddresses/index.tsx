import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import AccountAddressAction from '../AccountAddressAction';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';
import AddressCard from '../AddressCard';
import FormField from '../FormField';

export interface AccountAddressesProps extends AbstractComponentType {
  form?: string;
  field?: string;
  selectedAddressIndex?: number | null;
  setSelectedAddressIndex?: (selectedAddressIndex: number | null) => void;
}

const AccountAddresses = (
  props: AccountAddressesProps
): React.JSX.Element | null => {
  const app = useApp();
  const user = app.user;
  const [isNewAddressOpened, setIsNewAddressOpened] =
    React.useState<boolean>(false);
  const [openedAddressIndex, setOpenedAddressIndex] = React.useState<
    number | null
  >(null);

  const onDelete = (indexToDelete: number) => {
    if (!user) {
      return;
    }

    const newAddresses = user.addresses;
    newAddresses.splice(indexToDelete, 1);
    FirestoreModule<UserType>().writeDoc('users', user.uid, {
      ...user,
      addresses: newAddresses,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`account-addresses ${props.className ? props.className : ''}`}
    >
      <div className="account-addresses__list">
        {user.addresses.length > 0 ? (
          typeof props.selectedAddressIndex !== 'undefined' &&
          props.form &&
          props.field ? (
            <FormField
              form={props.form}
              field={props.field}
              type="checkbox"
              value={
                props.selectedAddressIndex === null
                  ? ''
                  : props.selectedAddressIndex.toString()
              }
              setValue={(value) => {
                if (
                  value &&
                  typeof props.setSelectedAddressIndex !== 'undefined'
                ) {
                  props.setSelectedAddressIndex(parseInt(value));
                }
              }}
              selectOptions={user.addresses.map((address, index) => ({
                label: (
                  <div key={index} className="account-addresses__list-item">
                    <AddressCard
                      address={address}
                      actions={[
                        {
                          label: <i className="fe fe-edit" />,
                          onClick: () => {
                            if (openedAddressIndex === null) {
                              setOpenedAddressIndex(index);
                            } else {
                              if (openedAddressIndex === index) {
                                setOpenedAddressIndex(null);
                              } else {
                                setOpenedAddressIndex(index);
                              }
                            }
                          },
                          className: 'btn btn-sm btn-outline-primary',
                        },
                        {
                          label: <i className="fe fe-trash" />,
                          onClick: () => onDelete(index),
                          className: 'btn btn-sm btn-outline-danger',
                        },
                      ]}
                    />
                    <AccountAddressAction
                      action="edit"
                      isAddressOpened={openedAddressIndex === index}
                      setIsAddressOpened={(isAddressOpened) =>
                        setOpenedAddressIndex(isAddressOpened ? index : null)
                      }
                      address={address}
                      addressIndex={index}
                      hasLabel={false}
                    />
                  </div>
                ),
                value: index.toString(),
              }))}
            />
          ) : (
            user.addresses.map((address, index) => (
              <div key={index} className="account-addresses__list-item">
                <AddressCard
                  address={address}
                  actions={[
                    {
                      label: <i className="fe fe-edit" />,
                      onClick: () => {
                        if (openedAddressIndex === null) {
                          setOpenedAddressIndex(index);
                        } else {
                          if (openedAddressIndex === index) {
                            setOpenedAddressIndex(null);
                          } else {
                            setOpenedAddressIndex(index);
                          }
                        }
                      },
                      className: 'btn btn-sm btn-outline-primary',
                    },
                    {
                      label: <i className="fe fe-trash" />,
                      onClick: () => onDelete(index),
                      className: 'btn btn-sm btn-outline-danger',
                    },
                  ]}
                />
                <AccountAddressAction
                  action="edit"
                  isAddressOpened={openedAddressIndex === index}
                  setIsAddressOpened={(isAddressOpened) =>
                    setOpenedAddressIndex(isAddressOpened ? index : null)
                  }
                  address={address}
                  addressIndex={index}
                  hasLabel={false}
                />
              </div>
            ))
          )
        ) : (
          <div className="account-addresses__list-empty-container">
            <hr className="flex-grow-1" />
            <span className="account-addresses__list-empty-label">
              {app.translator.t('components.accountAddresses.noAddresses')}
            </span>
            <hr className="flex-grow-1" />
          </div>
        )}
      </div>
      <AccountAddressAction
        action="new"
        isAddressOpened={isNewAddressOpened}
        setIsAddressOpened={(isAddressOpened) =>
          setIsNewAddressOpened(isAddressOpened)
        }
        onSuccess={() => {
          if (typeof props.setSelectedAddressIndex !== 'undefined') {
            props.setSelectedAddressIndex(user.addresses.length - 1);
          }
        }}
      />
    </div>
  );
};

export default AccountAddresses;
