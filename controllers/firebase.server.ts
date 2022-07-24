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

export const _firestore = getFirestore()
export const batchLimit = 500

export async function getFirebaseCustomers() {
   console.log("Fetching customers...")
   const collectionName: CollectionName = 'customers'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('first_name', 'asc').get()
   const responseData = snapshot.docs.map(d => d.data() as Customer)
   return responseData
}

export async function getAllFirebaseTransactions() {
   console.log(">> Fetching Firebase transactions <<")
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('paid_at', 'desc').get()
   const responseData = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return responseData
}

export async function getFirebaseCustomerTransactions(customerID: number) {
   console.log(">> Fetching Firebase transactions <<")
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customerID)
      .get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return transactions
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
   const dummy = await ref.where('dummy', '==', true).get()

   if (dummy.size) {
      const dummyBatch = _firestore.batch()
      dummy.forEach(d => dummyBatch.delete(d.ref))
      await dummyBatch.commit()
      console.log(`** Deleted ${dummy.size} ${collectionName} dummy data **`)
   }
}