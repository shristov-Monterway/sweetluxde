import React from 'react';
import { IsAppLoadingContextType } from '../contexts/AppContext';

const useInitIsAppLoading = (): IsAppLoadingContextType => {
  const [isAppLoading, setIsAppLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
  }, []);

  return {
    get: isAppLoading,
    set: setIsAppLoading,
  };
};

export default useInitIsAppLoading;
