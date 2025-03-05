import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import InvitationStatus from '../InvitationStatus';

export type PageClosedWithInvitationsProps = AbstractComponentType;

const PageClosedWithInvitations = (
  props: PageClosedWithInvitationsProps
): React.JSX.Element => {
  return (
    <div
      className={`page-closed-with-invitations ${props.className ? props.className : ''}`}
    >
      <InvitationStatus />
    </div>
  );
};

export default PageClosedWithInvitations;
