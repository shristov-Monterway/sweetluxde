import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Modal from '../Modal';
import CategoriesFilter from '../CategoriesFilter';
import PriceRangeFilter from '../PriceRangeFilter';
import AttributeFilter from '../AttributeFilter';
import FiltersResetButton from '../FiltersResetButton';
import { FilterType } from '../../../../types/internal/FilterType';
import useApp from '../../hooks/useApp';

export interface FiltersModalProps extends AbstractComponentType {
  showModal: boolean;
  setShowModal: (
    newShowModal: boolean | ((showModal: boolean) => boolean)
  ) => void;
  filters: FilterType;
  setFilters: (
    newFilters: FilterType | ((filters: FilterType) => FilterType)
  ) => void;
  resetFilters: () => void;
  showCategoryFilter?: boolean;
  showPriceFilter?: boolean;
  showAttributesFilter?: boolean;
}

const FiltersModal = (props: FiltersModalProps): React.JSX.Element => {
  const app = useApp();

  return (
    <Modal
      showModal={props.showModal}
      setShowModal={props.setShowModal}
      position="full-right"
      className={`filters-modal ${props.className ? props.className : ''}`}
      hasCloseButton={true}
      hasCloseWithBackground={true}
    >
      <div className="filters-modal__sections">
        <div>
          <FiltersResetButton
            className="btn btn-outline-danger"
            resetFilters={props.resetFilters}
          />
        </div>
        <hr />
        {props.showCategoryFilter === true ? (
          <div className="filters-modal__section">
            <CategoriesFilter
              containerClassName="filters-modal__category-section"
              filters={props.filters}
              setFilters={props.setFilters}
            />
            <hr />
          </div>
        ) : null}
        {props.showPriceFilter === true ? (
          <div className="filters-modal__section">
            <PriceRangeFilter
              filters={props.filters}
              setFilters={props.setFilters}
            />
            <hr />
          </div>
        ) : null}
        {props.showAttributesFilter === true
          ? app.config.attributesToFilter.map((attributeId, index) => (
              <div key={index} className="filters-modal__section">
                <AttributeFilter
                  filters={props.filters}
                  setFilters={props.setFilters}
                  attributeId={attributeId}
                  containerClassName="filters-modal__attribute-section"
                />
                <hr />
              </div>
            ))
          : null}
      </div>
    </Modal>
  );
};

export default FiltersModal;
