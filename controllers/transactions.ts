import { formatBaseCurrency } from "@utils/index"
import { timePeriodOptions, getTimePeriodDate } from "@utils/chart.utils"
import { _firestore, formatDocumentAmount } from "./firebase.server"
import { z } from "zod"
import { PostLiquidationSchema } from "./schemas.server"

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

export async function getAllLiquidations() {
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

export async function getLiquidationsPeriodic(time_period: typeof timePeriodOptions[number]) {
   console.log(`>> Fetching periodic transactions from  ${time_period} <<`)
   const collectionName: CollectionName = 'liquidations'
   const ref = _firestore.collection(collectionName)
   const date = getTimePeriodDate(time_period)
   const snapshot = await ref.where('paid_at', '>', date.value).get()
   const liquidations = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return liquidations
}

/**
 * This function converts the amount to the base currency (amount * 100).
 * Only pass the actual amount without conversion.
 */
export async function createLiquidation(payload: z.infer<typeof PostLiquidationSchema>) {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Creating ${collectionName} for ${payload.customer} <<`)
   const ref = _firestore.collection(collectionName).doc()

   /**
    * > Find the subscription with this plan id
    * > Validate customer field on subscription to match this customer id
    * > Audit this subscription's transactions if eligible for withdrawal
    * > if yes, post liquidation, else throw error
    */

   payload.amount = formatBaseCurrency(payload.amount, true)
   if (payload.fee) {
      payload.fee = formatBaseCurrency(payload.fee, true)
   }
   if (payload.interest_payout) {
      payload.interest_payout = formatBaseCurrency(payload.interest_payout, true)
   }
   payload.validated = false
   payload.status = 'success'
   payload.id = ref.id
   await ref.set(payload)
   return payload
}