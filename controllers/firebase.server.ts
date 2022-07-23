// Import the functions you need from the SDKs you need
import { formatBaseCurrency } from "@utils/index";
import { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin/app";
import { CollectionReference, DocumentData, DocumentSnapshot, getFirestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import serviceAccount from '@configs/firebase-admin-service-key.json';

if (admin.getApps().length === 0) {
   admin.initializeApp({
      credential: admin.cert(serviceAccount as ServiceAccount),
   })
}

export const firestore = getFirestore()
export const batchLimit = 500

type Doc = QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
export function formatDocumentAmount(doc: Doc, key = 'amount') {
   const data = doc.data()!
   data[key] = formatBaseCurrency(data[key])
   return data
}

export async function removeDummyRecords(ref: CollectionReference<DocumentData>, collectionName: Collection) {
   /**
    * Delete incomplete dummy data entered during collection creation
    */
   console.log(`** Grabbing dummy records **`)
   const dummy = await ref.where('dummy', '==', true).get()

   if (dummy.size) {
      const dummyBatch = firestore.batch()
      dummy.forEach(d => dummyBatch.delete(d.ref))
      await dummyBatch.commit()
      console.log(`** Deleted ${dummy.size} ${collectionName} dummy data **`)
   }
}