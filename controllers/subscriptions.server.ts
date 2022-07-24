import { _firestore, formatDocumentAmount } from "./firebase.server"

const collectionName: CollectionName = 'subscriptions'

export async function getCustomerSubscriptions(customerID: number) {
   console.log(`>> Fetching ${collectionName}... <<`)
   const ref = _firestore.collection(collectionName)
   const subscriptionsSnapshot = await ref.where('customer', '==', customerID).get()
   const sortRank: PaystackSubscription['status'][] = ['active', 'complete', 'cancelled']

   //Get an array of document refs of all related plans
   const plansRefs = subscriptionsSnapshot.docs.map(d => _firestore.doc('plans/' + d.data().plan))
   const plansSnaphot = await _firestore.getAll(...plansRefs)
   // Denormalize plans for easy reference
   const plansMap = plansSnaphot.map(d => formatDocumentAmount(d)).reduce((acc, plan) => {
      acc[plan.id] = plan
      return acc
   }, {} as _Object)

   const responseData = subscriptionsSnapshot.docs
      .map(d => {
         const sub = formatDocumentAmount(d)
         sub.plan = plansMap[sub.plan]
         //Rank each for sorting
         sortRank.forEach((status, i) => {
            if (sub.status === status) {
               sub['rank'] = sortRank.length - i
            }
         })
         return sub
      })
      .sort((a, b) => a.rank < b.rank ? 1 : -1)

   return responseData
}

export async function getSubscriptionTransactions(planCode: string, customerID: number) {
   console.log(`>> Fetching transactions for ${planCode} <<`)
   const ref = _firestore.collection('transactions')
   const transactionsRef = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', customerID)
      .where("plan", "==", planCode)
      .get()

   const responseData = transactionsRef.docs.map(d => formatDocumentAmount(d))
   return responseData
}