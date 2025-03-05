import React from 'react';
import { PublicConfigType } from '../../../types/internal/PublicConfigType';
import {
  FormErrorsContextType,
  InvitationStatusContextType,
} from '../contexts/AppContext';
import FirestoreModule from '../modules/FirestoreModule';
import { UserType } from '../../../types/internal/UserType';
import { useRouter } from 'next/router';

export interface UseInitInvitationStatusProps {
  user: UserType | null;
  formErrors: FormErrorsContextType;
  config: PublicConfigType;
}

const useInitInvitationStatus = (
  props: UseInitInvitationStatusProps
): InvitationStatusContextType => {
  const router = useRouter();
  const [value, setValue] = React.useState<string>('');
  const [isValid, setIsValid] = React.useState<boolean>(
    !props.config.hasRequiredInvitation
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (router.query.invitedBy && typeof router.query.invitedBy === 'string') {
      localStorage.setItem('invitedBy', router.query.invitedBy);
      setValue(router.query.invitedBy);
    }
  }, [router.query]);

  React.useEffect(() => {
    const handleStorageChange = () => {
      setValue(localStorage.getItem('invitedBy') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    const invitedBy =
      typeof localStorage.getItem('invitedBy') === 'string' &&
      localStorage.getItem('invitedBy') !== ''
        ? localStorage.getItem('invitedBy')
        : '';

    if (invitedBy !== null) {
      set(invitedBy);
    }
  }, []);

  React.useEffect(() => {
    if (props.user) {
      if (props.user.invitedBy) {
        set(props.user.invitedBy);
      } else {
        set('');
      }
    }
  }, [props.user, props.config]);

  React.useEffect(() => {
    const checkIsCodeValid = async (value: string): Promise<boolean> => {
      const user = await FirestoreModule<UserType>().getDoc('users', value);
      return !!user;
    };

    if (value !== null && value.length === 28) {
      setIsLoading(true);
      checkIsCodeValid(value)
        .then((isValid) => {
          setIsValid(isValid);
        })
        .catch(() => {
          setIsValid(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsValid(false);
    }
  }, [value]);

  React.useEffect(() => {
    if (isValid) {
      props.formErrors.set((formErrors) =>
        formErrors.filter((formError) => formError.form !== 'invitationStatus')
      );
    } else {
      props.formErrors.set((formErrors) => [
        ...formErrors,
        {
          form: 'invitationStatus',
          field: 'invitedBy',
          error: 'Required to be invited!',
        },
      ]);
    }
  }, [isValid]);

  const set = (value: string): void => {
    localStorage.setItem('invitedBy', value);
    window.dispatchEvent(new Event('localStorageChange'));
  };

  console.log(value);

  return {
    get: {
      value,
      isValid,
      isLoading,
    },
    set,
  };
};

export default useInitInvitationStatus;
