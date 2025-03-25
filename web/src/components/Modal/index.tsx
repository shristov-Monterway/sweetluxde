import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface ModalProps extends AbstractComponentType {
  showModal: boolean;
  setShowModal?: (
    newShowModal: boolean | ((showModal: boolean) => boolean)
  ) => void;
  children: React.JSX.Element | null | (React.JSX.Element | null)[];
  hasCloseButton: boolean;
  hasCloseWithBackground: boolean;
  header?: React.JSX.Element;
  closeButton?: React.JSX.Element;
  position?: 'bottom-center' | 'full-left' | 'full-right';
}

const Modal = (props: ModalProps): React.JSX.Element => {
  const app = useApp();

  const closeModal = () => {
    if (props.setShowModal) {
      props.setShowModal(false);
    } else {
      app.activeModal.set(null);
    }
  };

  return (
    <div
      className={`modal modal--${props.position ? props.position : 'bottom-center'} ${props.showModal ? 'modal--active' : ''}`}
    >
      <div className="modal__card">
        <div className="modal__card-header">
          {props.header ? props.header : null}
          {props.closeButton ? (
            <button
              className="btn btn-light ms-auto"
              onClick={() => closeModal()}
            >
              {props.closeButton}
            </button>
          ) : props.hasCloseButton ? (
            <button
              className="btn btn-light ms-auto"
              onClick={() => closeModal()}
            >
              {props.closeButton ? (
                props.closeButton
              ) : (
                <i className="fe fe-x" />
              )}
            </button>
          ) : null}
        </div>
        <div
          className={`modal__card-body ${props.className ? props.className : ''}`}
        >
          {props.children}
        </div>
      </div>
      <div
        className={`modal__card-background ${props.hasCloseWithBackground ? 'modal__card-background--active' : ''}`}
        onClick={() => {
          if (!props.hasCloseWithBackground) {
            return;
          } else {
            closeModal();
          }
        }}
      />
    </div>
  );
};

export default Modal;
