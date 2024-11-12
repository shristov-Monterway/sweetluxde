import {
  DocumentReference,
  CollectionReference,
  doc,
  collection,
  getDoc,
  Unsubscribe,
  onSnapshot,
  setDoc,
} from '@firebase/firestore';
import Firestore from '../services/Firebase/Firestore';

export interface FirestoreModuleType<T> {
  getDocRef: (entity: string, uid: string) => DocumentReference<T>;
  getCollectionRef: (entity: string) => CollectionReference<T>;
  getDoc: (entity: string, uid: string) => Promise<T | null>;
  writeDoc: (entity: string, uid: string, data: T) => Promise<void>;
  onSnapshot: (
    entity: string,
    uid: string,
    onChange: (data: T | null) => void
  ) => Unsubscribe;
}

const FirestoreModule = <T>(): FirestoreModuleType<T> => {
  return {
    getDocRef: (entity, uid) => {
      return doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
    },
    getCollectionRef: (entity) => {
      return collection(Firestore, entity) as CollectionReference<T>;
    },
    getDoc: async (entity, uid) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      const response = await getDoc(ref);
      if (response.exists()) {
        const data = response.data();
        if (data) {
          return data;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    writeDoc: async (entity: string, uid: string, data: T) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      await setDoc(ref, data, {
        merge: true,
      });
    },
    onSnapshot: (entity, uid, onChange) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      return onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          onChange(doc.data());
        } else {
          onChange(null);
        }
      });
    },
  };
};

export default FirestoreModule;
