import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import AuthForm from '../AuthForm';
import GoogleSignInButton from '../GoogleSignInButton';
import useApp from '../../hooks/useApp';

export interface AuthModalProps extends AbstractComponentType {
  showModal: boolean;
}

const AuthModal = (props: AuthModalProps): React.JSX.Element => {
  const app = useApp();

  return (
    <Modal
      showModal={props.showModal}
      className={`${props.className ? props.className : ''}`}
      hasCloseButton={true}
      hasCloseWithBackground={true}
    >
      {app.config.authenticationMethods.includes('google') ? (
        <div className="d-flex align-items-center justify-content-center gap-3">
          <h3 className="m-0 p-0">
            {app.translator.t('components.authModal.loginWith')}
          </h3>
          {app.config.authenticationMethods.includes('google') ? (
            <GoogleSignInButton
              className="btn btn-primary"
              onSuccess={() => app.activeModal.set(null)}
            />
          ) : null}
        </div>
      ) : null}
      {app.config.hasInvitations &&
      localStorage.getItem('invitedBy') !== null ? (
        <>
          <hr className="m-4" />
          <div className="d-flex align-items-center justify-content-center">
            <small>
              {app.translator.t('components.authModal.invitedBy', {
                id: localStorage.getItem('invitedBy'),
              })}
            </small>
          </div>
        </>
      ) : null}
      {app.config.authenticationMethods.includes('google') &&
      (app.config.authenticationMethods.includes('phone') ||
        app.config.authenticationMethods.includes('email')) ? (
        <hr className="m-4" />
      ) : null}
      {app.config.authenticationMethods.includes('phone') ||
      app.config.authenticationMethods.includes('email') ? (
        <AuthForm onSuccess={() => app.activeModal.set(null)} />
      ) : null}
    </Modal>
  );
};

export default AuthModal;
