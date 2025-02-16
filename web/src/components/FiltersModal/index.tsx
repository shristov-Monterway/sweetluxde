import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Modal from '../Modal';
import CategoriesFilter from '../CategoriesFilter';
import PriceRangeFilter from '../PriceRangeFilter/PriceRangeFilter';

export interface FiltersModalProps extends AbstractComponentType {
  showModal: boolean;
}

const FiltersModal = (props: FiltersModalProps): React.JSX.Element => {
  const app = useApp();

  return (
    <Modal
      showModal={props.showModal}
      position="full-left"
      className={`filters-modal ${props.className ? props.className : ''}`}
    >
      <div className="d-flex flex-column gap-3">
        <div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => app.filters.reset()}
          >
            {app.translator.t('components.filtersModal.reset')}
          </button>
        </div>
        <hr />
        <div className="filters-modal__category-section">
          <CategoriesFilter />
        </div>
        <hr />
        <div>
          <PriceRangeFilter />
        </div>
        <hr />
      </div>
    </Modal>
  );
};

export default FiltersModal;
