import React from 'react';
import { ActiveModalContextType } from '../contexts/AppContext';

const useInitActiveModal = (): ActiveModalContextType => {
  const [activeModal, setActiveModal] = React.useState<
    'authModal' | 'localeModal' | 'currencyModal' | 'navModal' | null
  >(null);

  return {
    get: activeModal,
    set: setActiveModal,
  };
};

export default useInitActiveModal;
