import React from 'react';
import { AppProps } from 'next/app';
import '../src/assets/styles/theme.scss';
import { NextSeo } from 'next-seo';
import AppContext from '../src/contexts/AppContext';
import { useRouter } from 'next/router';
import useInitTranslator from '../src/hooks/useInitTranslator';
import useInitTheme from '../src/hooks/useInitTheme';
import useInitUser from '../src/hooks/useInitUser';
import useInitCurrency from '../src/hooks/useInitCurrency';
import useInitFormErrors from '../src/hooks/useInitFormErrors';
import useInitProducts from '../src/hooks/useInitProducts';
import useInitActiveModal from '../src/hooks/useInitActiveModal';
import useInitBootstrapJs from '../src/hooks/useInitBootstrapJs';
import useSyncUserTranslator from '../src/hooks/useSyncUserTranslator';
import useSyncUserTheme from '../src/hooks/useSyncUserTheme';
import useSyncUserCurrency from '../src/hooks/useSyncUserCurrency';

const App = (props: AppProps): React.JSX.Element => {
  const { Component } = props;
  const router = useRouter();
  const translator = useInitTranslator();
  const theme = useInitTheme();
  const user = useInitUser();
  const currency = useInitCurrency();
  const formErrors = useInitFormErrors();
  const products = useInitProducts({
    locale: translator.locale,
    currency: currency.get,
  });
  const activeModal = useInitActiveModal();
  useInitBootstrapJs();

  useSyncUserTranslator({
    translator,
    user,
  });

  useSyncUserTheme({
    theme,
    user,
  });

  useSyncUserCurrency({
    currency,
    user,
  });

  return (
    <>
      <NextSeo title={translator.t(`pages.${router.pathname}.title`)} />
      <AppContext.Provider
        value={{
          translator,
          theme,
          user,
          currency,
          formErrors,
          products,
          activeModal,
        }}
      >
        <Component />
      </AppContext.Provider>
    </>
  );
};

export default App;
