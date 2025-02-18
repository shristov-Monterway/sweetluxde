import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FirestoreModule from '../../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';

export interface ThemeToggleProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const ThemeToggle = (props: ThemeToggleProps): React.JSX.Element => {
  const app = useApp();

  const onPress = () => {
    const newTheme = app.theme.get === 'light' ? 'dark' : 'light';

    if (app.user) {
      FirestoreModule<UserType>().writeDoc('users', app.user.uid, {
        ...app.user,
        theme: newTheme,
      });
    } else {
      app.theme.set(newTheme);
    }
  };

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={onPress}
    >
      {props.label ? (
        props.label
      ) : (
        <i className={`fe fe-${app.theme.get === 'light' ? 'moon' : 'sun'}`} />
      )}
    </button>
  );
};

export default ThemeToggle;
