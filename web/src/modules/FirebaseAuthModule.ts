import { Unsubscribe } from '@firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as defaultSignInWithEmailAndPassword,
  signInWithPhoneNumber as defaultSignInWithPhone,
  signInWithPopup as defaultSignInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  AuthProvider,
  getAdditionalUserInfo,
  signOut as defaultSignOut,
  RecaptchaVerifier,
  UserCredential,
} from 'firebase/auth';
import FirebaseAuth from '../services/Firebase/FirebaseAuth';
import { UserType } from '../../../types/internal/UserType';
import FirestoreModule from './FirestoreModule';

export type FirebaseAuthModuleSignInProvider = 'google';

export interface FirebaseAuthModuleType {
  onAuthChange: (onChange: (uid: string | null) => void) => Unsubscribe;
  signInWithEmailAndPassword: (
    email: string,
    password: string,
    initData: Omit<
      UserType,
      'uid' | 'email' | 'lastLogin' | 'cart' | 'wishlist' | 'isAdmin'
    >,
    onSuccess?: (uid: string) => void,
    onFailure?: (error: Error) => void
  ) => void;
  signInWithPopup: (
    provider: FirebaseAuthModuleSignInProvider,
    initData: Omit<
      UserType,
      'uid' | 'email' | 'lastLogin' | 'cart' | 'wishlist' | 'isAdmin'
    >,
    onSuccess?: (uid: string) => void,
    onFailure?: (error: Error) => void
  ) => void;
  requestPhoneNumberCode: (
    phone: string,
    recaptchaContainerId: string,
    onSuccess?: () => void,
    onFailure?: (error: Error) => void
  ) => void;
  signInWithPhoneNumber: (
    code: string,
    initData: Omit<
      UserType,
      'uid' | 'email' | 'lastLogin' | 'cart' | 'wishlist' | 'isAdmin'
    >,
    onSuccess?: (uid: string) => void,
    onFailure?: (error: Error) => void
  ) => void;
  signOut: (onSuccess?: () => void, onFailure?: (error: Error) => void) => void;
}

const FirebaseAuthModule = (): FirebaseAuthModuleType => {
  const handleOnFailure = (error: any, onFailure?: (error: Error) => void) => {
    if (onFailure) {
      if (error.code) {
        onFailure(new Error(error.code));
      } else {
        onFailure(error);
      }
    }
  };

  return {
    onAuthChange: (onChange) => {
      return onAuthStateChanged(FirebaseAuth, (auth) => {
        if (auth) {
          onChange(auth.uid);
        } else {
          onChange(null);
        }
      });
    },
    signInWithEmailAndPassword: (
      email,
      password,
      initData,
      onSuccess,
      onFailure
    ) => {
      defaultSignInWithEmailAndPassword(FirebaseAuth, email, password)
        .then((result) => {
          FirestoreModule<UserType>()
            .getDoc('users', result.user.uid)
            .then((user) => {
              if (user) {
                FirestoreModule<UserType>()
                  .writeDoc('users', result.user.uid, {
                    ...user,
                    lastLogin: new Date().getTime(),
                  })
                  .then(() => {
                    if (onSuccess) {
                      onSuccess(result.user.uid);
                    }
                  })
                  .catch((error) => {
                    handleOnFailure(error, onFailure);
                  });
              } else {
                signOut(FirebaseAuth)
                  .then(() => {
                    throw new Error(
                      'User is blocked. Please contact the support center.'
                    );
                  })
                  .catch((error) => {
                    handleOnFailure(error, onFailure);
                  });
              }
            })
            .catch((error) => {
              handleOnFailure(error, onFailure);
            });
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(FirebaseAuth, email, password)
              .then((result) => {
                FirestoreModule<UserType>()
                  .writeDoc('users', result.user.uid, {
                    ...initData,
                    lastLogin: new Date().getTime(),
                    uid: result.user.uid,
                    cart: {
                      lineItems: [],
                    },
                    wishlist: {
                      lineItems: [],
                    },
                    email,
                    isAdmin: false,
                  })
                  .then(() => {
                    if (onSuccess) {
                      onSuccess(result.user.uid);
                    }
                  })
                  .catch((error) => {
                    handleOnFailure(error, onFailure);
                  });
              })
              .catch((error) => {
                handleOnFailure(error, onFailure);
              });
          } else {
            handleOnFailure(error, onFailure);
          }
        });
    },
    signInWithPopup: (provider, initData, onSuccess, onFailure) => {
      let authProvider: AuthProvider | null = null;

      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
      }

      if (!authProvider) {
        throw new Error('Not valid provider given!');
      }

      defaultSignInWithPopup(FirebaseAuth, authProvider)
        .then((result) => {
          const additionalUserInfo = getAdditionalUserInfo(result);
          const isNewUser = !!additionalUserInfo?.isNewUser;
          const email =
            additionalUserInfo?.profile && additionalUserInfo.profile.email
              ? (additionalUserInfo.profile.email as string)
              : null;

          if (!email) {
            throw new Error('User has issue with the data!');
          }

          if (isNewUser) {
            FirestoreModule<UserType>()
              .writeDoc('users', result.user.uid, {
                ...initData,
                lastLogin: new Date().getTime(),
                uid: result.user.uid,
                cart: {
                  lineItems: [],
                },
                wishlist: {
                  lineItems: [],
                },
                email,
                isAdmin: false,
              })
              .then(() => {
                if (onSuccess) {
                  onSuccess(result.user.uid);
                }
              })
              .catch((error) => {
                handleOnFailure(error, onFailure);
              });
          } else {
            FirestoreModule<UserType>()
              .getDoc('users', result.user.uid)
              .then((user) => {
                if (user) {
                  FirestoreModule<UserType>()
                    .writeDoc('users', result.user.uid, {
                      ...user,
                      lastLogin: new Date().getTime(),
                    })
                    .then(() => {
                      if (onSuccess) {
                        onSuccess(result.user.uid);
                      }
                    })
                    .catch((error) => {
                      handleOnFailure(error, onFailure);
                    });
                } else {
                  signOut(FirebaseAuth)
                    .then(() => {
                      throw new Error(
                        'User is blocked. Please contact the support center.'
                      );
                    })
                    .catch((error) => {
                      handleOnFailure(error, onFailure);
                    });
                }
              })
              .catch((error) => {
                handleOnFailure(error, onFailure);
              });
          }
        })
        .catch((error) => {
          handleOnFailure(error, onFailure);
        });
    },
    requestPhoneNumberCode: (
      phone,
      recaptchaContainerId,
      onSuccess,
      onFailure
    ) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(
        FirebaseAuth,
        recaptchaContainerId,
        {
          size: 'normal',
          callback: () => {
            defaultSignInWithPhone(
              FirebaseAuth,
              phone,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              window.recaptchaVerifier
            )
              .then((confirmationResult) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.confirmationResult = confirmationResult;
                if (onSuccess) {
                  onSuccess();
                }
              })
              .catch((error) => {
                handleOnFailure(error, onFailure);
              });
          },
          'expired-callback': () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            grecaptcha.reset();
            handleOnFailure(new Error('Recaptcha expired!'), onFailure);
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.recaptchaVerifier.render().then(function (widgetId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.recaptchaWidgetId = widgetId;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // grecaptcha.execute(window.recaptchaWidgetId);
      });
    },
    signInWithPhoneNumber: (code, initData, onSuccess, onFailure) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!window && !window.confirmationResult) {
        handleOnFailure(
          new Error('Recaptcha confirmation is not checked!'),
          onFailure
        );
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.confirmationResult
        .confirm(code)
        .then((result: UserCredential) => {
          if (onSuccess) {
            onSuccess(result.user.uid);
          }
        })
        .catch((error: any) => {
          handleOnFailure(error, onFailure);
        });
    },
    signOut: (onSuccess, onFailure) => {
      defaultSignOut(FirebaseAuth)
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch((error) => {
          handleOnFailure(error, onFailure);
        });
    },
  };
};

export default FirebaseAuthModule;
