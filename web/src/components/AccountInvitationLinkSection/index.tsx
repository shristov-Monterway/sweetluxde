import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';

export interface AccountInvitationLinkSectionProps
  extends AbstractComponentType {
  uid: string;
}

const AccountInvitationLinkSection = (
  props: AccountInvitationLinkSectionProps
): React.JSX.Element => {
  const app = useApp();
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const invitationLink = `${origin}?invitedBy=${props.uid}`;
  const [showSuccessCopiedIcon, setShowSuccessCopiedIcon] =
    React.useState<boolean>(false);
  const [startedTimeout, setStartedTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  const onCopy = (): void => {
    navigator.clipboard.writeText(invitationLink);

    setShowSuccessCopiedIcon(true);

    if (startedTimeout) {
      clearTimeout(startedTimeout);
    }

    const newStartedTimeout = setTimeout(() => {
      setShowSuccessCopiedIcon(false);
    }, 2000);

    setStartedTimeout(newStartedTimeout);
  };

  return (
    <div
      className={`account-invitation-link-section card ${props.className ? props.className : ''}`}
    >
      <div className="card-body d-flex flex-column gap-3">
        <h3 className="m-0 p-0">
          {app.translator.t('components.accountInvitationLinkSection.title')}
        </h3>
        <div className="d-flex flex-column gap-1">
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control account-invitation-link-section__input"
              value={invitationLink}
              disabled={true}
            />
            <button className="btn btn-primary" onClick={() => onCopy()}>
              <i
                className={`fe fe-${showSuccessCopiedIcon ? 'check-circle' : 'copy'}`}
              />
            </button>
          </div>
          <p>
            {app.translator.t(
              'components.accountInvitationLinkSection.description'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountInvitationLinkSection;
