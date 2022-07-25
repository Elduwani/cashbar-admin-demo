import { formatBaseCurrency } from "@utils/index";
import { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin/app";
import { CollectionReference, DocumentData, DocumentSnapshot, getFirestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import serviceAccount from '@configs/firebase-admin-service-key.json';
import { getPastDate, dateFilterOptions } from "@utils/chart.utils";

if (admin.getApps().length === 0) {
   admin.initializeApp({
      credential: admin.cert(serviceAccount as ServiceAccount),
   })
}

export const _firestore = getFirestore()
export const batchLimit = 500

export async function getCustomers() {
   console.log("Fetching customers...")
   const collectionName: CollectionName = 'customers'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('first_name', 'asc').get()
   const responseData = snapshot.docs.map(d => d.data() as Customer)
   return responseData
}

type Doc = QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
export function formatDocumentAmount(doc: Doc, key = 'amount') {
   const data = doc.data() ?? doc
   data[key] = formatBaseCurrency(data[key])
   return data
}

export async function removeDummyRecords(ref: CollectionReference<DocumentData>, collectionName: CollectionName) {
   /**
    * Delete incomplete dummy data entered during collection creation
    */
   console.log(`** Grabbing dummy records **`)
   const records = await ref.where('dummy', '==', true).get()

   if (records.size) {
      const batch = _firestore.batch()
      records.forEach(d => batch.delete(d.ref))
      await batch.commit()
      console.log(`** Deleted ${records.size} ${collectionName} dummy data **`)
   }
}