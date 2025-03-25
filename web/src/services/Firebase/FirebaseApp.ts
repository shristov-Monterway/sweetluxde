import { initializeApp } from 'firebase/app';
import firebaseConfig from './config.json';

const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;
