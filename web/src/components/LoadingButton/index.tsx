import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface LoadingButtonProps extends AbstractComponentType {
  isLoading: boolean;
  label: string;
  onClick: () => void;
}

const LoadingButton = (props: LoadingButtonProps): React.JSX.Element => {
  return (
    <button
      className={`d-flex gap-3 align-items-center justify-content-center ${props.isLoading ? 'disabled' : ''} ${props.className ? props.className : ''}`}
      onClick={props.onClick}
    >
      <span>{props.label}</span>
      {props.isLoading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : null}
    </button>
  );
};

export default LoadingButton;
