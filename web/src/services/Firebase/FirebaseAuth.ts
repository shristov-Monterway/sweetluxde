import { getAuth, connectAuthEmulator } from 'firebase/auth';
import FirebaseApp from './FirebaseApp';
import firebaseConfig from '../../../../firebase/firebase.json';

const FirebaseAuth = getAuth(FirebaseApp);

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(
    FirebaseAuth,
    `http://127.0.0.1:${firebaseConfig.emulators.auth.port}`
  );
}

export default FirebaseAuth;
