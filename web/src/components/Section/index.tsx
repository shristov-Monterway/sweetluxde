import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import Breadcrumb from '../Breadcrumb';

export interface SectionProps extends AbstractComponentType {
  title: string;
  children: React.JSX.Element;
  description?: string;
  breadcrumbLink?: {
    label: string;
    url?: string;
  }[];
  headerContent?: React.JSX.Element | null;
}

const Section = (props: SectionProps): React.JSX.Element => {
  return (
    <div className={`section ${props.className ? props.className : ''}`}>
      <div className="section__header">
        {props.breadcrumbLink && props.breadcrumbLink.length > 0 ? (
          <Breadcrumb links={props.breadcrumbLink} />
        ) : null}
        <div className="section__heading">
          <h1 className="m-0 p-0">{props.title}</h1>
          {props.description ? (
            <span className="lead">{props.description}</span>
          ) : null}
        </div>
        {props.headerContent ? props.headerContent : null}
      </div>
      <hr className="m-0 p-0" />
      <div>{props.children}</div>
    </div>
  );
};

export default Section;
