import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FormField from '../FormField';

export type InvitationStatusProps = AbstractComponentType;

const InvitationStatus = (props: InvitationStatusProps): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`invitation-status ${app.formErrors.get.filter((formError) => formError.form === 'invitationStatus' && formError.field === 'invitedBy').length > 0 ? 'invitation-status--error' : ''} ${props.className ? props.className : ''}`}
    >
      <span className="invitation-status__label">
        {app.translator.t('components.invitationStatus.label')}
      </span>
      <FormField
        form="invitationStatus"
        field="invitedBy"
        type="text"
        value={app.invitationStatus.get.value}
        setValue={(value) => app.invitationStatus.set(value)}
        className="invitation-status__input-container"
        inputClassName="invitation-status__input"
      />
    </div>
  );
};

export default InvitationStatus;
