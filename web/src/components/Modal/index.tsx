import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface ModalProps extends AbstractComponentType {
  showModal: boolean;
  children: React.JSX.Element | null | (React.JSX.Element | null)[];
  header?: React.JSX.Element;
  closeButton?: React.JSX.Element;
  position?: 'bottom-center' | 'full-left' | 'full-right';
}

const Modal = (props: ModalProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`modal modal--${props.position ? props.position : 'bottom-center'} ${props.showModal ? 'modal--active' : ''}`}
    >
      <div className="modal__card">
        <div className="modal__card-header">
          {props.header ? props.header : null}
          <button
            className="btn btn-light ms-auto"
            onClick={() => app.activeModal.set(null)}
          >
            {props.closeButton ? props.closeButton : <i className="fe fe-x" />}
          </button>
        </div>
        <div
          className={`modal__card-body ${props.className ? props.className : ''}`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
