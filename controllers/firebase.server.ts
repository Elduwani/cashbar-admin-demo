// Import the functions you need from the SDKs you need
import { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin/app";
import { DocumentData, getFirestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import serviceAccount from './firebase-admin-service-key.json';

if (admin.getApps().length === 0) {
   admin.initializeApp({
      credential: admin.cert(serviceAccount as ServiceAccount),
   })
}

export const firestore = getFirestore()
export const batchLimit = 500

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//    apiKey: process.env.FIREBASE_API_KEY,
//    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//    projectId: process.env.FIREBASE_PROJECT_ID,
//    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//    appId: process.env.FIREBASE_APP_ID,
//    measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig)
// const db = adminDB.database()

export function mapDataId(doc: QueryDocumentSnapshot<DocumentData>) {
   const data = doc.data()
   data.id = doc.id
   return data
}