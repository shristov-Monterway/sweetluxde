import React from 'react';
import useApp from '../src/hooks/useApp';
import { useRouter } from 'next/router';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import SignOutButton from '../src/components/SignOutButton';
import AccountAdminSection from '../src/components/AccountAdminSection';
import SideNavContainer from '../src/components/SideNavContainer';
import InvitationLinkSection from '../src/components/InvitationLinkSection';
import AccountAddressSection from '../src/components/AccountAddressSection/AccountAddressSection';

const Account = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  const sections: {
    id: string;
    label: string | React.JSX.Element;
    element?: React.JSX.Element;
    className?: string;
  }[] = [
    {
      id: 'addresses',
      label: 'Addresses',
      element: <AccountAddressSection />,
      className: 'btn btn-outline-primary w-100',
    },
    {
      id: 'divider',
      label: <hr />,
    },
    {
      id: 'logOut',
      label: (
        <SignOutButton
          className="btn btn-primary w-100"
          onSuccess={() => {
            router.push('/');
          }}
        />
      ),
    },
  ];

  if (app.config.hasInvitations) {
    sections.unshift({
      id: 'invitation',
      label: 'Invitation',
      element: <InvitationLinkSection uid={app.user.uid} />,
      className: 'btn btn-outline-primary w-100',
    });
  }

  if (app.user && app.user.isAdmin) {
    sections.unshift({
      id: 'admin',
      label: 'Admin',
      element: <AccountAdminSection />,
      className: 'btn btn-outline-primary w-100',
    });
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <SideNavContainer isSideBarFixed={false} sections={sections} />
    </Page>
  );
};

export default Account;
