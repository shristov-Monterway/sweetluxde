import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FirebaseAuthModule from '../../modules/FirebaseAuthModule';

export interface SignOutButtonProps extends AbstractComponentType {
  children?: React.JSX.Element | React.JSX.Element[];
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

const SignOutButton = (props: SignOutButtonProps): React.JSX.Element => {
  const app = useApp();

  const onPress = (): void => {
    if (!app) {
      return;
    }

    FirebaseAuthModule().signOut(props.onSuccess, props.onFailure);
  };

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={onPress}
    >
      {props.children ? (
        props.children
      ) : (
        <span>{app.translator.t('components.signOutButton.signOut')}</span>
      )}
    </button>
  );
};

export default SignOutButton;
