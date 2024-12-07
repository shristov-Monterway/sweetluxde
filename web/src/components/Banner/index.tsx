import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { useRouter } from 'next/router';
import useApp from '../../hooks/useApp';

export interface BannerProps extends AbstractComponentType {
  backgroundImage: {
    src: string;
    alt?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xlg';
  box: {
    title: {
      content: string;
      size?: 1 | 2 | 3 | 4 | 5 | 6;
      color?: string;
    };
    description?: {
      content: string;
      color?: string;
    };
    links?: {
      content: string;
      href: string;
      type?:
        | 'primary'
        | 'outline-primary'
        | 'secondary'
        | 'outline-secondary'
        | 'success'
        | 'outline-success'
        | 'danger'
        | 'outline-danger'
        | 'warning'
        | 'outline-warning'
        | 'info'
        | 'outline-info';
      size?: 'sm' | 'lg';
    }[];
    position?:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right'
      | 'center-left'
      | 'center-center'
      | 'center-right';
    backgroundColor?: {
      [theme: string]: string;
    };
    isRounded?: boolean;
  };
}

const Banner = (props: BannerProps): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();
  const boxPosition = props.box.position ? props.box.position : 'center-center';

  return (
    <div className={`banner ${props.className ? props.className : ''}`}>
      <img
        className={`banner__background banner__background--${props.size ? props.size : 'md'}`}
        src={props.backgroundImage.src}
        alt={props.backgroundImage.alt ? props.backgroundImage.alt : ''}
      />
      <div className={`banner__container banner__container--${boxPosition}`}>
        <div className={`banner__box banner__box--${boxPosition}`}>
          <div
            className={`banner__box-background ${props.box.isRounded ? 'banner__box-background--rounded' : ''}`}
            style={{
              backgroundColor:
                props.box.backgroundColor &&
                props.box.backgroundColor[app.theme.get]
                  ? props.box.backgroundColor[app.theme.get]
                  : 'var(--bs-primary)',
            }}
          />
          <div
            className={`banner__box-content banner__box-content--${boxPosition}`}
          >
            <h1
              className={`display-${props.box.title.size ? props.box.title.size : 3} m-0 p-0`}
              style={{
                color: props.box.title.color ? props.box.title.color : 'white',
              }}
            >
              {props.box.title.content}
            </h1>
            {props.box.description ? (
              <p
                className="m-0 p-0"
                style={{
                  color: props.box.description.color
                    ? props.box.description.color
                    : 'white',
                }}
              >
                {props.box.description.content}
              </p>
            ) : null}
            {props.box.links && props.box.links.length > 0 ? (
              <div className="banner__box-links">
                {props.box.links.map((link, index) => (
                  <button
                    key={index}
                    className={`btn btn-${link.type ? link.type : 'primary'} ${link.size ? `btn-${link.size}` : ''}`}
                    onClick={() => {
                      if (link.href.startsWith('/')) {
                        router.push(link.href);
                      } else {
                        if (window) {
                          window.open(link.href, '_blank');
                        }
                      }
                    }}
                  >
                    {link.content}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
