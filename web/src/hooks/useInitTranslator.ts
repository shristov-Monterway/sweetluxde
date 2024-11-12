import { I18n } from 'i18n-js';
import { useRouter } from 'next/router';

const useInitTranslator = (): I18n => {
  const { locale, locales } = useRouter();

  const translations = locales
    ? locales.reduce(
        (previous, locale) => ({
          ...previous,
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          [locale]: require(`../translations/${locale}.json`),
        }),
        {}
      )
    : {};

  const i18n = new I18n(translations);

  i18n.defaultLocale = 'en';

  if (locale) {
    i18n.locale = locale;
  }

  return i18n;
};

export default useInitTranslator;
