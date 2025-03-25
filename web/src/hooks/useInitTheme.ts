import React from 'react';
import { ThemeContextType } from '../contexts/AppContext';

const useInitTheme = (): ThemeContextType => {
  const [theme, setTheme] = React.useState<string>('light');

  React.useEffect(() => {
    if (document) {
      const htmlTag = document.querySelector('html');
      if (htmlTag) {
        htmlTag.setAttribute('data-bs-theme', theme);
      }
    }
  }, [theme]);

  return {
    get: theme,
    set: setTheme,
  };
};

export default useInitTheme;
