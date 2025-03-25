import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import LocaleModalToggle from '../LocaleModalToggle';
import CurrencyModalToggle from '../CurrencyModalToggle';
import useApp from '../../hooks/useApp';
import { useRouter } from 'next/router';

export interface NavModalProps extends AbstractComponentType {
  showModal: boolean;
}

const NavModal = (props: NavModalProps): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();

  const changePage = (path: string): void => {
    router.push(path);
    app.activeModal.set(null);
  };

  return (
    <Modal
      showModal={props.showModal}
      className={`nav-modal ${props.className ? props.className : ''}`}
      hasCloseButton={true}
      hasCloseWithBackground={true}
      header={
        <ul className="nav-modal__nav-actions">
          <li className="nav-modal__nav-actions-item">
            <ThemeToggle className="btn btn-primary" />
          </li>
          <li className="nav-modal__nav-actions-item">
            <LocaleModalToggle className="btn btn-primary" />
          </li>
          <li className="nav-modal__nav-actions-item">
            <CurrencyModalToggle className="btn btn-primary" />
          </li>
        </ul>
      }
      position="full-right"
    >
      <ul className="nav-modal__nav">
        <li className="nav-modal__nav-item">
          <a className="nav-modal__nav-link" onClick={() => changePage('/')}>
            <i className="fe fe-home" />
            <span>{app.translator.t('pages./.title')}</span>
          </a>
        </li>
      </ul>
    </Modal>
  );
};

export default NavModal;
