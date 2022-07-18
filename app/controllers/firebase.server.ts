// Import the functions you need from the SDKs you need
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import serviceAccount from './firebase-admin-service-key.json';

let db: ReturnType<typeof admin['initializeApp']>

if (!admin.apps.length) {
   db = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: "https://lendo-demo.firebaseio.com"
   })
} else {
   db = admin.apps[0] as ReturnType<typeof admin['initializeApp']>
}

// const ref = db.database().ref('customers')
// ref.on("value", (snapshot) => {
//    console.log("inner");
//    console.log(snapshot.val());
// }, (error) => console.log(error));

export default db


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