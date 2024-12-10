import React from 'react';
import useApp from '../src/hooks/useApp';
import { useRouter } from 'next/router';
import NotFound from 'next/error';
import Page from '../src/components/Page';
import Header from '../src/components/Header';
import SignOutButton from '../src/components/SignOutButton';

const Account = (): React.JSX.Element => {
  const app = useApp();
  const router = useRouter();

  if (!app.user) {
    return <NotFound statusCode={404} />;
  }

  return (
    <Page isFluid={false} header={<Header hasShadow={true} />}>
      <SignOutButton
        onSuccess={() => {
          router.push('/');
        }}
      />
    </Page>
  );
};

export default Account;
