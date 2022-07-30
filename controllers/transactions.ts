import { getTimePeriodDate, timePeriodOptions } from "@utils/chart.utils"
import { formatDocumentAmount, _firestore } from "./firebase.server"

export async function getAllTransactions() {
   console.log(">> Fetching Firebase transactions <<")
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('paid_at', 'desc').get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return transactions
}

export async function getTransactionsPeriodic(time_period: typeof timePeriodOptions[number]) {
   console.log(`>> Fetching periodic transactions from  ${time_period} <<`)
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const date = getTimePeriodDate(time_period)
   const snapshot = await ref.where('paid_at', '>', date.value).get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return transactions
}

export async function getCustomerTransactions(customerID: string) {
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