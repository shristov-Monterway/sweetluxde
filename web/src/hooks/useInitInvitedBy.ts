import React from 'react';
import { useRouter } from 'next/router';
import { UserType } from '../../../types/internal/UserType';

export interface UseInitInvitedByProps {
  user: UserType | null;
}

const useInitInvitedBy = (props: UseInitInvitedByProps): void => {
  const router = useRouter();

  React.useEffect(() => {
    if (router.query.invitedBy && typeof router.query.invitedBy === 'string') {
      if (localStorage) {
        localStorage.setItem('invitedBy', router.query.invitedBy);
      }
    }

    if (props.user) {
      if (localStorage) {
        localStorage.removeItem('invitedBy');
      }
    }
  }, [router.query, props.user]);
};

export default useInitInvitedBy;
