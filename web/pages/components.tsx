import React from 'react';
import useApp from '../src/hooks/useApp';
import Page from '../src/components/Page';
import AuthForm from '../src/components/AuthForm';
import GoogleSignInButton from '../src/components/GoogleSignInButton';
import SignOutButton from '../src/components/SignOutButton';

const Components = (): React.JSX.Element => {
  const app = useApp();
  return (
    <Page>
      <h1>{app.user ? app.user.uid : 'Not logged in'}</h1>
      <hr />
      <AuthForm onSuccess={() => alert('Welcome!')} />
      <hr />
      <GoogleSignInButton
        className="btn btn-primary"
        onSuccess={() => alert('Welcome!')}
        onFailure={(error) => alert(error)}
      />
      <hr />
      <SignOutButton
        className="btn btn-primary"
        onSuccess={() => alert('Buy buy!')}
        onFailure={(error) => alert(error)}
      />
    </Page>
  );
};

export default Components;
