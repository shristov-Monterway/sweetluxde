import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';

export interface RangeSliderProps extends AbstractComponentType {
  minValue: number;
  setMinValue: (newMinValue: number) => void;
  maxValue: number;
  setMaxValue: (newMaxValue: number) => void;
  min: number;
  max: number;
  step?: number;
  minValueOutput?: string | React.JSX.Element;
  maxValueOutput?: string | React.JSX.Element;
}

const RangeSlider = (props: RangeSliderProps): React.JSX.Element => {
  const step = props.step ? props.step : 100;

  React.useEffect(() => {
    const newMin = Math.min(
      Math.max(props.minValue, props.min),
      props.maxValue
    );
    const newMax = Math.max(
      Math.min(props.maxValue, props.max),
      props.minValue
    );

    if (newMin !== props.minValue) props.setMinValue(newMin);
    if (newMax !== props.maxValue) props.setMaxValue(newMax);
  }, [props.minValue, props.maxValue, props.min, props.max]);

  return (
    <div className={`range-slider ${props.className ? props.className : ''}`}>
      <div className="range-slider__container">
        <div className="range-slider__track" />
        <div
          className="range-slider__track-active"
          style={{
            left: `${((props.minValue - props.min) / (props.max - props.min)) * 100}%`,
            width: `${((props.maxValue - props.minValue) / (props.max - props.min)) * 100}%`,
          }}
        />

        <input
          type="range"
          min={props.min}
          max={props.max}
          step={step}
          value={props.minValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(
              Number(event.target.value),
              props.maxValue - step
            );
            props.setMinValue(value);
          }}
          className="range-slider__slider range-slider__slide--min"
        />

        <input
          type="range"
          min={props.min}
          max={props.max}
          step={step}
          value={props.maxValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(
              Number(event.target.value),
              props.minValue + step
            );
            props.setMaxValue(value);
          }}
          className="range-slider__slider range-slider__slider--max"
        />
      </div>
      <div className="range-slider__values">
        {props.minValueOutput ? (
          props.minValueOutput
        ) : (
          <span>{props.minValue}</span>
        )}
        {props.maxValueOutput ? (
          props.maxValueOutput
        ) : (
          <span>{props.maxValue}</span>
        )}
      </div>
    </div>
  );
};

export default RangeSlider;
