import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { Element, Link } from 'react-scroll';
import useApp from '../../hooks/useApp';

export interface SideNavContainerProps extends AbstractComponentType {
  isSideBarFixed: boolean;
  sections: {
    id: string;
    label: string | React.JSX.Element;
    element?: React.JSX.Element;
    className?: string;
  }[];
}

const SideNavContainer = (props: SideNavContainerProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`side-nav-container ${props.isSideBarFixed ? 'side-nav-container--fixed' : ''}`}
    >
      <div
        className={`side-nav-container__container ${props.className ? props.className : ''}`}
      >
        {props.sections.map((section, index) => {
          if (section.element) {
            return (
              <Element key={index} name={section.id}>
                {section.element}
              </Element>
            );
          }
        })}
      </div>
      <div className="side-nav-container__sidebar">
        <div className="side-nav-container__sidebar-container">
          {props.sections.map((section, index) => (
            <div key={index}>
              {typeof section.label === 'string' ? (
                <Link
                  to={section.id}
                  smooth={true}
                  offset={0 - app.config.headerHeight}
                  className={section.className ? section.className : ''}
                >
                  {section.label}
                </Link>
              ) : (
                section.label
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavContainer;
