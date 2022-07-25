import { dateFilterOptions, getPastDate } from "@utils/chart.utils"
import { _firestore, formatDocumentAmount } from "./firebase.server"

export async function getAllTransactions() {
   console.log(">> Fetching Firebase transactions <<")
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('paid_at', 'desc').get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return transactions
}

export async function getTransactionsPeriodic(time_period: typeof dateFilterOptions[number]) {
   console.log(`>> Fetching periodic transactions from  ${time_period} <<`)
   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)
   const date = getPastDate(time_period)
   const snapshot = await ref.where('paid_at', '>', date.value).get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction | PaystackTransaction)
   return transactions
}

export async function getCustomerTransactions(customerID: number) {
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

export async function getLiquidations() {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Fetching ${collectionName} <<`)
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('paid_at', 'desc').get()
   const liquidations = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return liquidations
}

export async function getCustomerLiquidations(customerID: number) {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Fetching customer ${collectionName} for ${customerID} <<`)
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customerID)
      .get()
   const liquidations = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return liquidations
}

/**
 * This function converts the amount to the base currency (amount / 100).
 * Only pass the actual amount without conversion.
 */
export async function createLiquidation(liquidation: Liquidation, customerID: string) {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Creating ${collectionName} for ${customerID} <<`)
   const ref = _firestore.collection(collectionName).doc()
   liquidation.id = ref.id
   liquidation.amount = liquidation.amount / 100
   liquidation.customer = customerID
   await ref.set(liquidation)
   return liquidation
}