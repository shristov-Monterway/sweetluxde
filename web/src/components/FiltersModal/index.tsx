import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import CategoriesFilter from '../CategoriesFilter';
import PriceRangeFilter from '../PriceRangeFilter/PriceRangeFilter';
import AttributeFilter from '../AttributeFilter';
import FiltersResetButton from '../FiltersResetButton';

export interface FiltersModalProps extends AbstractComponentType {
  showModal: boolean;
}

const FiltersModal = (props: FiltersModalProps): React.JSX.Element => {
  return (
    <Modal
      showModal={props.showModal}
      position="full-left"
      className={`filters-modal ${props.className ? props.className : ''}`}
      hasCloseButton={true}
      hasCloseWithBackground={true}
    >
      <div className="d-flex flex-column gap-3">
        <div>
          <FiltersResetButton className="btn btn-outline-danger" />
        </div>
        <hr />
        <CategoriesFilter containerClassName="filters-modal__category-section" />
        <hr />
        <PriceRangeFilter />
        <hr />
        <AttributeFilter
          attributeId="size"
          containerClassName="filters-modal__attribute-section"
        />
      </div>
    </Modal>
  );
};

export default FiltersModal;
