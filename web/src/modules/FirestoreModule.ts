import {
  DocumentReference,
  CollectionReference,
  doc,
  collection,
  getDoc,
  getDocs,
  Unsubscribe,
  onSnapshot,
  setDoc,
  query as defaultQuery,
  where,
  deleteDoc,
} from '@firebase/firestore';
import Firestore from '../services/Firebase/Firestore';
import firebase from 'firebase/compat';
import WhereFilterOp = firebase.firestore.WhereFilterOp;

export interface FirestoreModuleType<T> {
  getDocRef: (entity: string, uid: string) => DocumentReference<T>;
  getCollectionRef: (entity: string) => CollectionReference<T>;
  getDoc: (entity: string, uid: string) => Promise<T | null>;
  getCollection: (
    entity: string,
    queries?: {
      property: string;
      opStr: WhereFilterOp;
      value: any;
    }[]
  ) => Promise<T[]>;
  writeDoc: (entity: string, uid: string, data: T) => Promise<void>;
  deleteDoc: (entity: string, uid: string) => Promise<void>;
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
          return {
            ...data,
            uid: response.id,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    getCollection: async (entity, queries) => {
      const ref = collection(Firestore, `${entity}`) as CollectionReference<T>;
      let q = defaultQuery(ref);
      if (queries) {
        queries.forEach((query) => {
          q = defaultQuery(q, where(query.property, query.opStr, query.value));
        });
      }
      const response = await getDocs(q);
      return response.docs.map((response) => ({
        ...response.data(),
        uid: response.id,
      }));
    },
    writeDoc: async (entity: string, uid: string, data: T) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      await setDoc(ref, data, {
        merge: true,
      });
    },
    deleteDoc: async (entity: string, uid: string) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      await deleteDoc(ref);
    },
    onSnapshot: (entity, uid, onChange) => {
      const ref = doc(Firestore, `${entity}/${uid}`) as DocumentReference<T>;
      return onSnapshot(ref, (response) => {
        if (response.exists()) {
          onChange({
            ...response.data(),
            uid: response.id,
          });
        } else {
          onChange(null);
        }
      });
    },
  };
};

export default FirestoreModule;
