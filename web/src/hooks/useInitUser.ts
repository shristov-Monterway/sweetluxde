import React from 'react';
import { Unsubscribe } from '@firebase/firestore';
import FirebaseAuthModule from '../modules/FirebaseAuthModule';
import FirestoreModule from '../modules/FirestoreModule';
import { UserType } from '../../../types/internal/UserType';

const useInitUser = (): UserType | null => {
  const [uid, setUid] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    const subscriber = FirebaseAuthModule().onAuthChange((uid) => {
      if (uid) {
        setUid(uid);
      } else {
        setUid(null);
      }
    });
    return () => {
      subscriber();
    };
  }, []);

  React.useEffect(() => {
    let subscriber: Unsubscribe | null = null;

    if (uid) {
      subscriber = FirestoreModule<UserType>().onSnapshot(
        'users',
        uid,
        (user) => {
          if (user) {
            setUser(user);
          } else {
            setUid(null);
            setUser(null);
          }
        }
      );
    } else {
      setUser(null);
    }

    return () => {
      if (subscriber) {
        subscriber();
      }
    };
  }, [uid]);

  return user;
};

export default useInitUser;
