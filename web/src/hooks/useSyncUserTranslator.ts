import React from 'react';
import { UserType } from '../../../types/internal/UserType';
import { I18n } from 'i18n-js';
import { useRouter } from 'next/router';

export interface UseSyncUserTranslatorProps {
  translator: I18n;
  user: UserType | null;
}

const useSyncUserTranslator = (props: UseSyncUserTranslatorProps): void => {
  const router = useRouter();

  React.useEffect(() => {
    if (props.user && props.user.locale) {
      router.push(router.pathname, router.asPath, {
        locale: props.user.locale,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);
};

export default useSyncUserTranslator;
