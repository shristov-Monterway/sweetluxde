import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FirebaseAuthModule from '../../modules/FirebaseAuthModule';
import FormField from '../FormField';
import Script from 'next/script';

export interface AuthFormProps extends AbstractComponentType {
  onSuccess?: (uid: string) => void;
  onFailure?: (error: Error) => void;
}

const AuthForm = (props: AuthFormProps): React.JSX.Element => {
  const id = 'auth';
  const phoneSignInRecaptcha = 'phone-sign-in-recaptcha';
  const app = useApp();
  const [authFormType, setAuthFormType] = React.useState<'email' | 'phone'>(
    app.config.authenticationMethods.includes('email') ? 'email' : 'phone'
  );
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [isCodeRequested, setIsCodeRequested] = React.useState<boolean>(false);
  const [isCodeRequestLifetimeOpened, setIsCodeRequestLifetimeOpened] =
    React.useState<boolean>(true);
  const [codeRequestLifetime, setCodeRequestLifetime] = React.useState<
    null | number
  >(null);

  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setPhone('');
    setCode('');
    setIsCodeRequested(false);
    setIsCodeRequestLifetimeOpened(true);
    setCodeRequestLifetime(null);
  }, [authFormType]);

  React.useEffect(() => {
    if (codeRequestLifetime !== null) {
      if (codeRequestLifetime === 0) {
        setCodeRequestLifetime(null);
        setIsCodeRequestLifetimeOpened(true);
      } else {
        setTimeout(() => {
          setCodeRequestLifetime(codeRequestLifetime - 1);
        }, 1000);
      }
    }
  }, [codeRequestLifetime]);

  const onRequestCode = (): void => {
    if (!isCodeRequestLifetimeOpened) {
      return;
    }

    app.formErrors.set([]);

    setCode('');

    FirebaseAuthModule().requestPhoneNumberCode(
      phone,
      phoneSignInRecaptcha,
      () => {
        setIsCodeRequestLifetimeOpened(false);
        setIsCodeRequested(true);
        setCodeRequestLifetime(10);
      },
      (error) => {
        app.formErrors.set([
          {
            form: 'auth',
            field: 'phone',
            error: error.message,
          },
        ]);

        setIsCodeRequestLifetimeOpened(true);
        setIsCodeRequested(false);
      }
    );
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (app.config.hasRequiredInvitation) {
      const invitedBy = localStorage.getItem('invitedBy');
      if (!invitedBy) {
        app.formErrors.set([
          {
            form: 'invitationStatus',
            field: 'invitedBy',
            error: 'Required to be invited!',
          },
        ]);
        return;
      }
    }

    app.formErrors.set([]);

    if (authFormType === 'email') {
      FirebaseAuthModule().signInWithEmailAndPassword(
        email,
        password,
        {
          locale: app.translator.locale,
          theme: app.theme.get,
          currency: app.currency.get,
          invitedBy: app.config.hasRequiredInvitation
            ? localStorage.getItem('invitedBy')
            : app.config.hasInvitations &&
                localStorage.getItem('invitedBy') &&
                localStorage.getItem('invitedBy') !== ''
              ? localStorage.getItem('invitedBy')
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
    } else {
      FirebaseAuthModule().signInWithPhoneNumber(
        code,
        {
          email: phone,
          locale: app.translator.locale,
          theme: app.theme.get,
          currency: app.currency.get,
          invitedBy: app.config.hasRequiredInvitation
            ? localStorage.getItem('invitedBy')
            : app.config.hasInvitations &&
                localStorage.getItem('invitedBy') &&
                localStorage.getItem('invitedBy') !== ''
              ? localStorage.getItem('invitedBy')
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
              field: 'code',
              error: error.message,
            },
          ]);
        }
      );
    }
  };

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" />
      <form
        className={`form d-flex flex-column gap-4 ${props.className ? props.className : ''}`}
        onSubmit={onSubmit}
      >
        {app.config.authenticationMethods.includes('email') &&
        app.config.authenticationMethods.includes('phone') ? (
          <div className="d-flex gap-3">
            {app.config.authenticationMethods.includes('email') ? (
              <button
                type="button"
                className={`flex-grow-1 btn btn-outline-primary ${authFormType === 'email' ? 'active' : ''}`}
                onClick={() => setAuthFormType('email')}
              >
                Email <i className="fe fe-inbox" />
              </button>
            ) : null}
            {app.config.authenticationMethods.includes('phone') ? (
              <button
                type="button"
                className={`flex-grow-1 btn btn-outline-primary ${authFormType === 'phone' ? 'active' : ''}`}
                onClick={() => setAuthFormType('phone')}
              >
                Phone <i className="fe fe-phone" />
              </button>
            ) : null}
          </div>
        ) : null}
        {app.config.authenticationMethods.includes('email') &&
        authFormType === 'email' ? (
          <div className="d-flex flex-column gap-3">
            <FormField
              form="auth"
              field="email"
              type="email"
              value={email}
              setValue={(newEmail) => setEmail(newEmail)}
            />
            <FormField
              form="auth"
              field="password"
              type="password"
              value={password}
              setValue={(newPassword) => setPassword(newPassword)}
            />
          </div>
        ) : null}
        {app.config.authenticationMethods.includes('phone') &&
        authFormType === 'phone' ? (
          <div className="d-flex flex-column gap-4">
            <FormField
              form="auth"
              field="phone"
              type="text"
              value={phone}
              setValue={(newPhone) => setPhone(newPhone)}
              className="flex-grow-1"
              disabled={!isCodeRequestLifetimeOpened}
            />
            {isCodeRequested ? (
              <FormField
                form="auth"
                field="code"
                type="text"
                value={code}
                setValue={(newCode) => setCode(newCode)}
              />
            ) : null}
            <div className="d-flex flex-column">
              <div
                className="pb-3"
                id={phoneSignInRecaptcha}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={onRequestCode}
                className="btn btn-primary w-100"
                disabled={!isCodeRequestLifetimeOpened}
              >
                {codeRequestLifetime
                  ? app.translator.t(`components.authForm.requestCodeMinutes`, {
                      seconds: codeRequestLifetime,
                    })
                  : app.translator.t(`components.authForm.requestCode`)}
              </button>
            </div>
          </div>
        ) : null}
        {authFormType === 'phone' && !isCodeRequested ? null : (
          <button type="submit" className="btn btn-primary w-100">
            {app.translator.t(`form.submit.${id}`)}
          </button>
        )}
      </form>
    </>
  );
};

export default AuthForm;
