import { getTimePeriodDate, timePeriodOptions } from "@utils/chart.utils"
import { formatBaseCurrency } from "@utils/index"
import { PostExpenseSchema } from "./schemas.server"
import { formatDocumentAmount, _firestore } from "./firebase.server"
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

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

/**
 * This function converts the amount to the base currency (amount * 100).
 * Only pass the actual amount without conversion.
 */
export async function createExpense(payload: z.infer<typeof PostExpenseSchema>) {
   const collectionName: CollectionName = 'expenses'
   const ref = _firestore.collection(collectionName).doc()

   console.log(`>> Creating ${collectionName} <<`)

   payload.id = ref.id
   payload.validated = false
   payload.reference = uuid()
   payload.status = 'success'
   payload.amount = formatBaseCurrency(payload.amount, true)
   addDatesMetaTags(payload)

   await ref.set(payload)
   return payload
}

export function addDatesMetaTags(payload: _Object) {
   const date = new Date().toISOString()
   payload.created_at = date
   if (!payload.updated_at) {
      payload.updated_at = date
   }
}

export async function getAuthorizationTokens(customerID: string) {
   const transactions = await getCustomerTransactions(customerID)
   const tokens = transactions?.reduce((acc: _Object[], trx) => {
      if (
         trx.status === "success" && trx.channel === "card" &&
         'authorization' in trx && trx.authorization.reusable
      ) {
         acc.push(trx.authorization)
      }

      return acc
   }, [])

   return tokens
}