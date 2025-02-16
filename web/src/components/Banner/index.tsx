import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export interface BannerProps extends AbstractComponentType {
  backgroundImage: {
    src: string;
    alt?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  box: {
    title: {
      content: string;
      size?: 1 | 2 | 3 | 4 | 5 | 6;
      color?: {
        [theme: string]: string;
      };
    };
    description?: {
      content: string;
      color?: {
        [theme: string]: string;
      };
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
                color:
                  props.box.title.color && props.box.title.color[app.theme.get]
                    ? props.box.title.color[app.theme.get]
                    : 'white',
              }}
            >
              {props.box.title.content}
            </h1>
            {props.box.description ? (
              <p
                className="m-0 p-0"
                style={{
                  color:
                    props.box.description.color &&
                    props.box.description.color[app.theme.get]
                      ? props.box.description.color[app.theme.get]
                      : 'white',
                }}
              >
                {props.box.description.content}
              </p>
            ) : null}
            {props.box.links && props.box.links.length > 0 ? (
              <div className="banner__box-links">
                {props.box.links.map((link, index) => (
                  <Link key={index} href={link.href} passHref={true}>
                    <a
                      className={`btn btn-${link.type ? link.type : 'primary'} ${link.size ? `btn-${link.size}` : ''}`}
                      target={link.href.startsWith('/') ? '' : '_blank'}
                    >
                      {link.content}
                    </a>
                  </Link>
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
