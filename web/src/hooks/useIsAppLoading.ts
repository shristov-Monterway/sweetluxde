import React from 'react';
import useApp from './useApp';

const useIsAppLoading = (): boolean => {
  const app = useApp();
  const [isAppLoading, setIsAppLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (app) {
      setIsAppLoading(false);
    } else {
      setIsAppLoading(true);
    }
  }, [app]);

  return isAppLoading;
};

export default useIsAppLoading;
