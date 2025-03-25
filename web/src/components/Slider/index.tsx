import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export type SliderConfigViewport = 'desktop' | 'tablet' | 'mobile';

export interface SliderProps extends AbstractComponentType {
  config: {
    [key in SliderConfigViewport]: {
      breakpoint: {
        max: number;
        min: number;
      };
      items: number;
    };
  };
  children: React.JSX.Element[];
}

const Slider = (props: SliderProps): React.JSX.Element => {
  const sliderRef = React.useRef<Carousel | null>(null);

  return (
    <div className={`slider ${props.className ? props.className : ''}`}>
      <Carousel
        responsive={props.config}
        ref={(slider) => (sliderRef.current = slider)}
      >
        {props.children.map((slide, index) => (
          <div key={index}>{slide}</div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
