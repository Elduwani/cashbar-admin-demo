import { formatBaseCurrency } from "@utils/index"
import { timePeriodOptions, getTimePeriodDate } from "@utils/chart.utils"
import { _firestore, formatDocumentAmount } from "./firebase.server"
import { PostLiquidationSchema } from "./schemas.server"
import { z } from "zod"
import { addDatesMetaTags } from "./transactions.server"

const collectionName: CollectionName = 'subscriptions'

export async function verifySubscription(subscription: string, plan: string, customer: string) {
   console.log(`>> Fetching single ${collectionName}... <<`)
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.doc(subscription).get()
   const data = snapshot.data()

   if (
      data &&
      data.customer === customer &&
      data.plan === plan
   ) return true

   throw new Error("Subscription not found for customer")
}

export async function getCustomerSubscriptions(customer: string) {
   console.log(`>> Fetching ${collectionName}... <<`)
   const ref = _firestore.collection(collectionName)
   const subscriptionsSnapshot = await ref.where('customer', '==', customer).get()
   const sortRank: PaystackSubscription['status'][] = ['active', 'complete', 'cancelled']

   //_firestore.getAll with throw if arguments (subscriptionsSnapshot) is empty
   if (!subscriptionsSnapshot.size) {
      return [] as Subscription[]
   }

   //Get an array of document refs of all related plans
   console.log(`>> Fetching related plans... <<`)
   const plansRefs = subscriptionsSnapshot.docs.map(d => _firestore.doc('plans/' + d.data().plan))
   const plansSnaphot = await _firestore.getAll(...plansRefs)
   // Denormalize plans for easy reference
   const plansMap = plansSnaphot.map(d => formatDocumentAmount(d)).reduce((acc, plan) => {
      //Filter out plans without an amount field.
      if (plan.amount) {
         acc[plan.id] = plan
      }
      return acc
   }, {} as _Object)

   console.log(`>> Linking plans & sorting subscriptions... <<`)
   const responseData = subscriptionsSnapshot.docs
      .map(d => {
         const sub = formatDocumentAmount(d)
         //Filter out subs with invalid plans
         if (plansMap[sub.plan]) {
            sub.plan = plansMap[sub.plan]
         }
         //Rank each for sorting
         sortRank.forEach((status, i) => {
            if (sub.status === status) {
               sub['rank'] = sortRank.length - i
            }
         })
         return sub as Subscription
      })
      //Filter out subs with invalid plans
      .filter(sub => !!sub.plan.amount)
      .sort((a: _Object, b: _Object) => a.rank < b.rank ? 1 : -1)

   return responseData
}

export async function getSubscriptionTransactions(plan: string, customer: string) {
   console.log(`>> Fetching transactions for ${plan} <<`)
   const ref = _firestore.collection('transactions')
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customer)
      .where("plan", "==", plan)
      .get()

   const responseData = snapshot.docs.map(d => formatDocumentAmount(d) as Transaction)
   return responseData
}

export async function getAllLiquidations() {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Fetching ${collectionName} <<`)
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref.orderBy('paid_at', 'desc').get()
   const liquidations = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return liquidations
}

export async function getCustomerLiquidations(customer: number) {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Fetching customer ${collectionName} for ${customer} <<`)
   const ref = _firestore.collection(collectionName)
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customer)
      .get()
   const liquidations = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return liquidations
}

export async function getSubscriptionLiquidations(plan: string, customer: string) {
   console.log(`>> Fetching liquidations for ${plan} <<`)
   const ref = _firestore.collection('liquidations')
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customer)
      .where("plan", "==", plan)
      .get()

   const responseData = snapshot.docs.map(d => formatDocumentAmount(d) as Liquidation)
   return responseData
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

export async function getSubscriptionAnalysis(plan: string, customer: string): Promise<SubscriptionAnalysis> {
   const transactions = await getSubscriptionTransactions(plan, customer)
   const liquidations = await getSubscriptionLiquidations(plan, customer)

   const transaction_volume = transactions.reduce((acc, trx) => {
      if (trx.status === 'success') {
         acc += trx.amount
      }
      return acc
   }, 0)

   const liquidation_volume = liquidations.reduce((acc, liq) => {
      if (liq.status === 'success') {
         acc += liq.amount
      }
      return acc
   }, 0)

   const merged_data = [
      ...transactions,
      ...liquidations.map(l => {
         l.is_liquidation = true
         return l
      })
   ].sort((a, b) => new Date(a.paid_at).getTime() < new Date(b.paid_at).getTime() ? 1 : -1)

   const percentage_liquidated = transaction_volume ? liquidation_volume * 100 / transaction_volume : 0

   return {
      // transactions,
      // liquidations,
      transaction_count: transactions.length,
      liquidation_count: liquidations.length,
      transaction_volume,
      liquidation_volume,
      percentage_liquidated,
      balance: transaction_volume - liquidation_volume,
      merged_data,
   }
}

/**
 * This function converts the amount to the base currency (amount * 100).
 * Only pass the actual amount without conversion.
 */
export async function createLiquidation(payload: z.infer<typeof PostLiquidationSchema>) {
   const collectionName: CollectionName = 'liquidations'
   console.log(`>> Creating ${collectionName} for ${payload.customer} <<`)

   /**
    * > Find the subscription with this plan id.
    * > Validate customer field on subscription to match this customer id.
    * > Audit this subscription's liquidations vs balance if eligible for withdrawal.
    * > If yes, post liquidation, else throw error
    */

   const ref = _firestore.collection(collectionName).doc()
   await verifySubscription(payload.subscription, payload.plan, payload.customer)
   const analysis = await getSubscriptionAnalysis(payload.plan, payload.customer)

   if (analysis.balance < payload.amount) {
      throw new Error('Insufficient balance')
   }

   payload.id = ref.id
   payload.amount = formatBaseCurrency(payload.amount, true)
   if (payload.fee) {
      payload.fee = formatBaseCurrency(payload.fee, true)
   }
   if (payload.interest_payout) {
      payload.interest_payout = formatBaseCurrency(payload.interest_payout, true)
   }
   payload.validated = false
   payload.status = 'success'
   addDatesMetaTags(payload)

   await ref.set(payload)
   return payload
}