import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import { useRouter } from 'next/router';
import * as localeCodes from 'locale-codes';
import Modal from '../Modal';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';

export interface LocaleToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const LocaleToggle = (props: LocaleToggleProps): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const locale = router.locale;
  const locales = router.locales;
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');

  if (!locale) {
    throw new Error('Locale is not defined!');
  }

  if (!locales || locales.length === 0) {
    throw new Error('No list with supported locales!');
  }

  const onPress = (newLocale: string) => {
    if (app.user) {
      FirestoreModule<UserType>().writeDoc('users', app.user.uid, {
        ...app.user,
        locale: newLocale,
      });
    } else {
      router.push(router.pathname, router.asPath, {
        locale: newLocale,
      });
    }
  };

  return (
    <div>
      <button
        className={`btn btn-primary btn-sm ${props.className ? props.className : ''}`}
        onClick={() => setShowModal(!showModal)}
      >
        {props.label ? props.label : <i className="fe fe-globe" />}
      </button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        header={
          <input
            className="form-control"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={app.translator.t('components.localeToggle.search')}
          />
        }
      >
        <div className="d-flex flex-wrap gap-1">
          {locales
            .map((locale) => localeCodes.getByTag(locale))
            .filter((locale) => {
              return locale.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((supportedLocale, index) => (
              <button
                key={index}
                className={`btn ${locale === supportedLocale.tag ? 'btn-primary' : 'btn-light'}`}
                onClick={() => onPress(supportedLocale.tag)}
              >
                {supportedLocale.name}
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default LocaleToggle;
