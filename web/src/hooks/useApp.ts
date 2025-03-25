import React from 'react';
import AppContext, { AppContextType } from '../contexts/AppContext';

const useApp = (): AppContextType => {
  return React.useContext(AppContext) as AppContextType;
};

export default useApp;
