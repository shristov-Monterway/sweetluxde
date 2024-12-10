import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface ModalProps extends AbstractComponentType {
  showModal: boolean;
  setShowModal: (newShow: boolean) => void;
  children: React.JSX.Element | React.JSX.Element[];
  header?: React.JSX.Element;
  closeButton?: React.JSX.Element;
}

const Modal = (props: ModalProps): React.JSX.Element => {
  return (
    <div className={`modal ${props.showModal ? 'modal--active' : ''}`}>
      <div className="modal__card">
        <div className="modal__card-header">
          {props.header ? props.header : null}
          <button
            className="btn btn-light ms-auto"
            onClick={() => props.setShowModal(false)}
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
