import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import Link from 'next/link';

export type AccountAdminSectionProps = AbstractComponentType;

const AccountAdminSection = (
  props: AccountAdminSectionProps
): React.JSX.Element | null => {
  const app = useApp();

  if (!app.user || !app.user.isAdmin) {
    return null;
  }

  return (
    <div
      className={`account-admin-section card card-body ${props.className ? props.className : ''}`}
    >
      <div className="account-admin-section__label">
        {app.translator.t('components.accountAdminSection.message')}
      </div>
      <div className="account-admin-section__actions">
        <Link href="/admin" passHref={true}>
          <a className="btn btn-outline-primary">
            {app.translator.t('components.accountAdminSection.manage')}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AccountAdminSection;
