import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import AuthForm from '../AuthForm';
import GoogleSignInButton from '../GoogleSignInButton';
import useApp from '../../hooks/useApp';

export interface AuthModalProps extends AbstractComponentType {
  label?: React.JSX.Element;
}

const AuthModal = (props: AuthModalProps): React.JSX.Element => {
  const app = useApp();
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div>
      <button
        className={`btn btn-primary btn-sm ${props.className ? props.className : ''}`}
        onClick={() => setShowModal(!showModal)}
      >
        {props.label ? props.label : <i className="fe fe-user" />}
      </button>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="d-flex align-items-center justify-content-center gap-3">
          <h3 className="m-0 p-0">
            {app.translator.t('components.authModal.loginWith')}
          </h3>
          <GoogleSignInButton onSuccess={() => setShowModal(false)} />
        </div>
        <hr className="m-5" />
        <AuthForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};

export default AuthModal;
