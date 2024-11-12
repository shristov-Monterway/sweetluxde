import React from 'react';

const useInitBootstrapJs = (): void => {
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
};

export default useInitBootstrapJs;
