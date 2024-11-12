import * as express from 'express';
import * as admin from 'firebase-admin';
import FirestoreModule from '../modules/FirestoreModule';
import { UserType } from '../../../../types/internal/UserType';

export interface AuthenticationHandlerType {
  setUserInRequest: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>;
}

const AuthenticationHandler: AuthenticationHandlerType = {
  setUserInRequest: async (req, res, next) => {
    let idToken: string | null = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies && req.cookies.__session) {
      idToken = req.cookies.__session;
    }

    if (idToken !== null) {
      const user = await admin.auth().verifyIdToken(idToken);
      if (user.uid) {
        const userDoc = await FirestoreModule<UserType>().getDoc('users', user.uid);
        if (userDoc) {
          req.user = userDoc;
        } else {
          req.user = null;
        }
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  },
};

export default AuthenticationHandler;
