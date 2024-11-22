import * as admin from 'firebase-admin';

export interface FirestoreModuleType<T> {
  getDocRef: (
    entity: string,
    uid: string
  ) => FirebaseFirestore.DocumentReference<T>;
  getCollectionRef: (
    entity: string
  ) => FirebaseFirestore.CollectionReference<T>;
  getDoc: (entity: string, uid: string) => Promise<T | null>;
  getCollection: (entity: string) => Promise<T[]>;
  writeDoc: (entity: string, uid: string, data: T) => Promise<void>;
  deleteCollectionDocs: (entity: string) => Promise<void>;
}

const FirestoreModule = <T>(): FirestoreModuleType<T> => {
  return {
    getDocRef: (entity, uid) => {
      return admin
        .firestore()
        .doc(`${entity}/${uid}`) as FirebaseFirestore.DocumentReference<T>;
    },
    getCollectionRef: (entity) => {
      return admin
        .firestore()
        .collection(entity) as FirebaseFirestore.CollectionReference<T>;
    },
    getDoc: async (entity, uid) => {
      const ref = admin
        .firestore()
        .doc(`${entity}/${uid}`) as FirebaseFirestore.DocumentReference<T>;
      const response = await ref.get();
      if (response.exists) {
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
    getCollection: async (entity) => {
      const ref = admin
        .firestore()
        .collection(entity) as FirebaseFirestore.CollectionReference<T>;
      const response = await ref.get();
      return response.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
    },
    writeDoc: async (entity: string, uid: string, data: T) => {
      const ref = admin
        .firestore()
        .doc(`${entity}/${uid}`) as FirebaseFirestore.DocumentReference<T>;
      await ref.set(data);
    },
    deleteCollectionDocs: async (entity: string) => {
      const ref = admin
        .firestore()
        .collection(entity) as FirebaseFirestore.CollectionReference<T>;
      const response = await ref.get();

      if (response.empty) {
        return;
      }

      const batch = admin.firestore().batch();

      response.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    },
  };
};

export default FirestoreModule;
