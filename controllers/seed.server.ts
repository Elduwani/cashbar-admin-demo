import path from "path"
import { sub } from "date-fns"
import fs from "fs"
import { batchLimit, getFirebaseCustomers, removeDummyRecords, _firestore } from "./firebase.server"
import { getPaystackCustomers, getPaystackPlans, getPaystackSubscriptions, getPaystackTransactions, verifyPaystackTransaction } from "./paystack.server"

export async function seedCustomers() {
   const collectionName: CollectionName = 'customers'
   const batch = _firestore.batch()
   const ref = _firestore.collection(collectionName)

   console.log(`** Fetching Paystack ${collectionName} **`)
   const customers = await getPaystackCustomers();

   for (const customer of customers.data) {
      customer['updatedAt'] = new Date().toISOString()
      console.log(`Adding ${customer.email}...`)
      batch.set(ref.doc(String(customer.id)), customer)
   }

   console.log("** Committing batch **")
   await batch.commit()

   await removeDummyRecords(ref, collectionName)

   return {
      status: "success",
      message: `${customers.data.length} customers were seeded successfully`,
   }
}

export async function seedPlans() {
   const collectionName: CollectionName = 'plans'
   const ref = _firestore.collection(collectionName);

   console.log(`** Fetching Paystack ${collectionName} **`)
   const plans = await getPaystackPlans<Partial<PaystackPlan>>()
   console.log(`** Fetched ${plans.data.length} ${collectionName} **`)
   //Firebase batch only allows 500 writes per request
   //Split data into chunks
   const batchCount = Math.ceil(plans.data.length / batchLimit)

   for (let i = 0; i < batchCount; i++) {
      const batch = _firestore.batch()
      const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
      const chunk = plans.data.slice(start, end)
      console.log("*".repeat(30))
      console.log({ start, end })

      for (const plan of chunk) {
         if (!plan.is_deleted) {
            plan['updatedAt'] = new Date().toISOString()
            delete plan.total_subscriptions
            delete plan.active_subscriptions
            delete plan.total_subscriptions_revenue
            delete plan.subscriptions
            console.log(`Adding ${plan.id}...`)
            batch.set(ref.doc(String(plan.id)), plan);
         }
      }

      //Commit chunk
      console.log("** Committing batch **")
      await batch.commit()
   }

   await removeDummyRecords(ref, collectionName)
   console.log("**** Success ****")

   return {
      status: "success",
      message: `${plans.data.length} ${collectionName} were seeded successfully`
   }
}

export async function seedSubscriptions() {
   const collectionName: CollectionName = 'subscriptions'
   console.log(`** Fetching Paystack ${collectionName} **`)
   const subscriptions = await getPaystackSubscriptions()
   const ref = _firestore.collection(collectionName)

   //Firebase batch only allows 500 writes per request
   //Split data into chunks
   const batchCount = Math.ceil(subscriptions.data.length / batchLimit)

   for (let i = 0; i < batchCount; i++) {
      const batch = _firestore.batch()
      const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
      const chunk = subscriptions.data.slice(start, end)
      console.log("><".repeat(30))
      console.log({ start, end })

      for (const sub of chunk) {
         sub['updatedAt'] = new Date().toISOString()
         sub['customer'] = (sub.customer as any).id
         sub['plan'] = (sub.plan as any).id
         delete sub['most_recent_invoice']
         delete sub['payments_count']

         console.log(`Adding ${sub.id}...`)
         batch.set(ref.doc(String(sub.id)), sub);
      }

      //Commit chunk
      console.log("** Committing batch **")
      await batch.commit()
   }

   await removeDummyRecords(ref, collectionName)
   console.log("**** Success ****")

   return {
      status: "success",
      message: `${subscriptions.data.length} ${collectionName} were seeded successfully`
   }
}

export async function seedTransactions() {
   console.log("Fetching Paystack transactions")
   const collectionName: CollectionName = 'transactions'

   const paystackTransactions = await getPaystackTransactions();
   if (!paystackTransactions.data?.length) {
      throw new Error("No Paystack transactions found")
   }

   //Only seed transactions that are within the last 12 months
   const timestamp = sub(new Date(), { months: 12 })
   const transactions = paystackTransactions.data
      .filter(trx => new Date(trx.paid_at).getTime() > timestamp.getTime())

   //Fetch seeded customers
   console.log("Fetching Firebase customers")
   const ref = _firestore.collection(collectionName)
   const firebaseCustomers = await getFirebaseCustomers()
   if (!firebaseCustomers.length) {
      throw new Error("Customers have not been seeded yet.")
   }

   //Bring user ID's forward for faster reference 
   const firebaseCustomersData = firebaseCustomers.reduce((acc, curr) => {
      acc[curr.id] = curr.id
      return acc
   }, {} as Record<string, string>)

   //Firebase batch only allows 500 writes per request, so split data into chunks
   let seededCount = 0
   const batchCount = Math.ceil(transactions.length / batchLimit)

   for (let i = 0; i < batchCount; i++) {
      const batch = _firestore.batch()
      const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
      const chunk = transactions.slice(start, end)
      console.log("><".repeat(30))
      console.log({ start, end })

      for (const trx of chunk) {
         trx['updatedAt'] = new Date().toISOString()
         const customer = firebaseCustomersData[trx.customer.id]

         if (customer?.length) {
            console.log(`Adding ${trx.customer.email}...`)
            //@ts-ignore
            trx['customer'] = +customer
            batch.set(ref.doc(String(trx.id)), trx);
            seededCount++
         }
      }

      //Commit chunk
      console.log("** Committing batch **")
      await batch.commit()
   }

   await removeDummyRecords(ref, collectionName)
   console.log("**** Done ****")

   return {
      status: "success",
      message: `${seededCount} transactions were seeded successfully`
   }
}

export async function linkTransactionsToPlans() {
   /**
    * This function will get the related plan information for all seeded transactions
    * so they can be linked, as Paystack doesn't link transaction to plans unless
    * when said transaction is verified.
    */

   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)

   const dir = path.join(process.cwd(), 'verified_transactions_log.json')
   console.log(`>> Checking content from ${dir}`)
   const verifiedTransactions = JSON.parse(fs.readFileSync(dir, 'utf8')) as PaystackTransaction[]

   if (verifiedTransactions?.[0]?.plan?.length) {
      //Use local content saved to file
      console.log(`>> Using local content <<`)
      const batchCount = Math.ceil(verifiedTransactions.length / batchLimit)

      for (let i = 0; i < batchCount; i++) {
         const batch = _firestore.batch()
         const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
         const chunk = verifiedTransactions.slice(start, end)
         console.log("><".repeat(30))
         console.log({ start, end })

         for (const trx of chunk) {
            console.log(`Adding ${trx.id}...`)
            //@ts-ignore
            trx.customer = +trx.customer
            batch.set(ref.doc(String(trx.id)), trx)
         }

         //Commit chunk
         console.log("** Committing batch **")
         await batch.commit()
      }
      console.log("** Done **")

   } else {

      //Use cloud content
      const data = []
      const transactions = await ref.get()
      console.log(`>> Fetched ${transactions.size} Firebase transactions <<`)

      if (!transactions.size) {
         throw new Error("Transactions have not been seeded")
      }

      for (let i = 0; i < transactions.docs.length; i++) {
         const trx = transactions.docs[i].data()
         console.log(trx.paid_at)
         const verifiedTrx = await verifyPaystackTransaction(trx.reference)
         //TODO: this is the plan code only, revise to link plan ID instead
         trx.plan = verifiedTrx.data.plan
         data.push(trx)
         console.log(`>> Verified ${i} of ${transactions.size} <<`)
      }

      console.log(`>> Writing contents to ${dir} <<`)
      fs.writeFileSync(
         dir,
         JSON.stringify(data, null, 2),
         { flag: 'w+' }
      )
      console.log("** Done **")

   }

   await removeDummyRecords(ref, collectionName)
   return "Done"
}