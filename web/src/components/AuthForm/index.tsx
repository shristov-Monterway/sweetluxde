import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import { useRouter } from 'next/router';
import FirebaseAuthModule from '../../modules/FirebaseAuthModule';
import FormField from '../FormField';

export interface AuthFormProps extends AbstractComponentType {
  onSuccess?: (uid: string) => void;
  onFailure?: (error: Error) => void;
}

const AuthForm = (props: AuthFormProps): React.JSX.Element => {
  const id = 'auth';
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const app = useApp();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!app) {
      return;
    }

    app.formErrors.set([]);

    FirebaseAuthModule().signInWithEmailAndPassword(
      email,
      password,
      {
        locale: app.translator.locale,
        theme: app.theme.get,
        currency: app.currency.get,
        invitedBy: router.query.invitedBy
          ? router.query.invitedBy.toString()
          : null,
      },
      (uid) => {
        if (props.onSuccess) {
          props.onSuccess(uid);
        }
      },
      (error) => {
        if (props.onFailure) {
          props.onFailure(error);
        }
        app.formErrors.set((formErrors) => [
          ...formErrors,
          {
            form: 'auth',
            field: error.message.includes('password') ? 'password' : 'email',
            error: error.message,
          },
        ]);
      }
    );
  };

  return (
    <form
      className={`${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    >
      <div className="mb-3">
        <FormField
          form="auth"
          field="email"
          type="email"
          value={email}
          setValue={(newEmail) => setEmail(newEmail)}
        />
      </div>
      <div className="mb-3">
        <FormField
          form="auth"
          field="password"
          type="password"
          value={password}
          setValue={(newPassword) => setPassword(newPassword)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        {app.translator.t(`form.submit.${id}`)}
      </button>
    </form>
  );
};

export default AuthForm;
