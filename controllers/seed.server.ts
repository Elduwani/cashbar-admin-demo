import { sub } from "date-fns"
import fs from "fs"
import { NextApiRequest } from "next"
import path from "path"
import { batchLimit, removeDummyRecords, _firestore } from "./firebase.server"
import { getPaystackCustomers, getPaystackPlans, getPaystackSubscriptions, getPaystackTransactions, verifyPaystackTransaction } from "./paystack.server"

export const verifiedFileLocation = path.join(process.cwd(), 'verified_transactions_log.json')

export async function seedCustomers() {
   const collectionName: CollectionName = 'customers'
   const batch = _firestore.batch()
   const ref = _firestore.collection(collectionName)

   console.log(`** Fetching Paystack ${collectionName} **`)
   const customers = await getPaystackCustomers();

   for (const customer of customers.data) {
      customer['updatedAt'] = new Date().toISOString()
      customer['id'] = String(customer.id)
      console.log(`Adding ${customer.email}...`)
      batch.set(ref.doc(customer.id), customer)
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
   const plans = await getPaystackPlans() as PaystackResponse<Partial<PaystackPlan>[]>
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
            plan['id'] = String(plan.id)
            delete plan.total_subscriptions
            delete plan.active_subscriptions
            delete plan.total_subscriptions_revenue
            delete plan.subscriptions
            console.log(`Adding ${plan.id}...`)
            batch.set(ref.doc(plan.id), plan);
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
         if ((sub as any).plan?.is_deleted) {
            continue
         }
         sub['updatedAt'] = new Date().toISOString()
         sub['customer'] = String((sub.customer as any).id)
         sub['plan'] = String((sub.plan as any).id)
         sub['id'] = String(sub.id)
         delete sub['most_recent_invoice']
         delete sub['payments_count']

         console.log(`Adding ${sub.id}...`)
         batch.set(ref.doc(sub.id), sub);
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

   const ref = _firestore.collection(collectionName)

   //Only seed transactions that are within the last 12 months
   const timestamp = sub(new Date(), { months: 12 })
   const transactions = paystackTransactions.data
      .filter(trx => new Date(trx.paid_at).getTime() > timestamp.getTime())

   //Firebase batch only allows 500 writes per request, so split data into chunks
   let seededCount = 0
   const batchCount = Math.ceil(transactions.length / batchLimit)

   for (let i = 0; i < batchCount; i++) {
      const batch = _firestore.batch()
      const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
      const chunk = transactions.slice(start, end)
      console.log("><".repeat(30))
      console.log('Adding batch', i, { start, end })

      for (const trx of chunk) {
         trx['id'] = String(trx.id)
         trx['updatedAt'] = new Date().toISOString()
         //@ts-ignore
         trx['customer'] = String(trx.customer.id)
         batch.set(ref.doc(trx.id), trx);
         seededCount++
      }

      //Commit chunk
      console.log("** Committing batch **")
      await batch.commit()
   }

   await linkTransactionsToPlans()
   await removeDummyRecords(ref, collectionName)
   console.log("**** Transactions seeded ****")

   return {
      status: "success",
      message: `${seededCount} transactions were seeded successfully`
   }
}

/**
 * This function will get the related plan information for all seeded transactions
 * so they can be linked, as Paystack doesn't link transaction to plans unless the
 * transaction is verified through their API.
 */
export async function linkTransactionsToPlans() {
   console.log(">> Linking transactions to plans <<")

   const collectionName: CollectionName = 'transactions'
   const ref = _firestore.collection(collectionName)

   async function updateFirebase(transactions: _Object) {
      console.log(">> Linking Firebase records")
      let batch = _firestore.batch()
      let index = 0

      for (const key in transactions) {
         const trx = transactions[key]
         console.log(`Linking ${trx.id}...`)
         batch.set(ref.doc(key), trx)

         if (index > 0 && index % batchLimit === 0) {
            //Commit chunk
            console.log("** Committing batch **")
            await batch.commit()
            //Reset batch
            batch = _firestore.batch()
            console.log("><".repeat(30))
         }

         index++
      }

      await batch.commit()
      console.log("** Done **")
   }

   try {
      //Use local content saved to file
      console.log(`>> Checking content from ${verifiedFileLocation}`)
      const verifiedTransactions = JSON.parse(fs.readFileSync(verifiedFileLocation, 'utf8')) as _Object

      if (verifiedTransactions?.constructor === Object) {
         console.log(`>> Using local content <<`)
         await updateFirebase(verifiedTransactions)
      }

      else throw new Error("!! Saved file not an Object !!")

   } catch (error: any) {

      //Use cloud content
      console.log(error.message)
      console.log(`>> Using cloud content. This will take a while... <<`)

      const data: _Object = {}
      const transactions = await ref.get()
      console.log(`>> Fetched ${transactions.size} Firebase transactions <<`)

      if (!transactions.size) {
         throw new Error("Transactions have not been seeded")
      }

      for (let i = 0; i < transactions.size; i++) {
         const trx = transactions.docs[i].data()
         const verifiedTrx = await verifyPaystackTransaction(trx.reference)
         if (verifiedTrx.data.plan_object.is_deleted) {
            continue
         }
         trx.id = String(trx.id)
         trx.plan = String(verifiedTrx.data.plan_object.id)
         trx.plan_code = verifiedTrx.data.plan_object.plan_code
         data[trx.id] = trx
         console.log(`>> Verified ${i} of ${transactions.size} <<`)
      }

      console.log(`>> Writing contents to ${verifiedFileLocation} <<`)

      fs.writeFileSync(
         verifiedFileLocation,
         JSON.stringify(data, null, 2),
         { encoding: 'utf8', flag: 'w+' }
      )

      await updateFirebase(data)
      console.log("** Done **")
   }

   return "Ok"
}

export function verifyHeaders(req: NextApiRequest) {
   if (process.env.NODE_ENV !== 'development') {
      throw new Error("Please seed documents in development only")
   }
   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      throw new Error("Invalid request headers")
   }
}