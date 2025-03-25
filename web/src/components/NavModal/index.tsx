import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import useApp from '../../hooks/useApp';

export interface NavModalProps extends AbstractComponentType {
  showModal: boolean;
}

const NavModal = (props: NavModalProps): React.JSX.Element => {
  const app = useApp();

  return (
    <Modal
      showModal={props.showModal}
      className={`${props.className ? props.className : ''}`}
      hasCloseButton={true}
      hasCloseWithBackground={true}
      position="full-right"
    >
      <h1>Nav</h1>
    </Modal>
  );
};

export default NavModal;
