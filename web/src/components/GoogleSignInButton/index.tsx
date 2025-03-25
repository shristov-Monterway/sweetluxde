import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FirebaseAuthModule from '../../modules/FirebaseAuthModule';
import useApp from '../../hooks/useApp';

export interface GoogleSignInButtonProps extends AbstractComponentType {
  children?: React.JSX.Element | React.JSX.Element[];
  onSuccess?: (uid: string) => void;
  onFailure?: (error: Error) => void;
}

const GoogleSignInButton = (
  props: GoogleSignInButtonProps
): React.JSX.Element => {
  const app = useApp();

  const onPress = (): void => {
    if (app.config.hasRequiredInvitation) {
      const invitedBy = localStorage.getItem('invitedBy');
      if (!invitedBy) {
        app.formErrors.set([
          {
            form: 'invitationStatus',
            field: 'invitedBy',
            error: 'Required to be invited!',
          },
        ]);
        return;
      }
    }

    app.formErrors.set([]);

    FirebaseAuthModule().signInWithPopup(
      'google',
      {
        locale: app.translator.locale,
        theme: app.theme.get,
        currency: app.currency.get,
        invitedBy: app.config.hasRequiredInvitation
          ? localStorage.getItem('invitedBy')
          : app.config.hasInvitations &&
              localStorage.getItem('invitedBy') &&
              localStorage.getItem('invitedBy') !== ''
            ? localStorage.getItem('invitedBy')
            : null,
      },
      props.onSuccess,
      props.onFailure
    );
  };

  return (
    <button
      className={`${props.className ? props.className : ''}`}
      onClick={onPress}
    >
      {props.children ? props.children : <span>Google</span>}
    </button>
  );
};

export default GoogleSignInButton;
