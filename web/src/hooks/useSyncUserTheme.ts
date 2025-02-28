import React from 'react';
import { ThemeContextType } from '../contexts/AppContext';
import { UserType } from '../../../types/internal/UserType';

export interface UseSyncUserThemeProps {
  theme: ThemeContextType;
  user: UserType | null;
}

const useSyncUserTheme = (props: UseSyncUserThemeProps): void => {
  React.useEffect(() => {
    if (props.user && props.user.theme) {
      props.theme.set(props.user.theme);
    }
  }, [props.user]);
};

export default useSyncUserTheme;
