import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import FormField from '../FormField';

export interface InvitationStatusProps extends AbstractComponentType {}

const InvitationStatus = (props: InvitationStatusProps): React.JSX.Element => {
  const app = useApp();
  const [invitedBy, setInvitedBy] = React.useState<string>('');

  React.useEffect(() => {
    const invitedBy = localStorage.getItem('invitedBy');
    if (invitedBy) {
      setInvitedBy(invitedBy);
    } else {
      localStorage.setItem('invitedBy', '');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('invitedBy', invitedBy);
  }, [invitedBy]);

  return (
    <div
      className={`invitation-status ${app.formErrors.get.filter((formError) => formError.form === 'invitation' && formError.field === 'invitedBy').length > 0 ? 'invitation-status--error' : ''} ${props.className ? props.className : ''}`}
    >
      <span className="invitation-status__label">
        {app.translator.t('components.invitationStatus.label')}
      </span>
      <FormField
        form="invitation"
        field="invitedBy"
        type="text"
        value={invitedBy}
        setValue={(value) => setInvitedBy(value)}
        className="invitation-status__input-container"
        inputClassName="invitation-status__input"
      />
    </div>
  );
};

export default InvitationStatus;
