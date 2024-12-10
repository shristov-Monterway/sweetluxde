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
    >
      <div className="d-flex align-items-center justify-content-center gap-3">
        <h3 className="m-0 p-0">
          {app.translator.t('components.authModal.loginWith')}
        </h3>
        <GoogleSignInButton onSuccess={() => app.activeModal.set(null)} />
      </div>
      <hr className="m-5" />
      <AuthForm onSuccess={() => app.activeModal.set(null)} />
    </Modal>
  );
};

export default AuthModal;
