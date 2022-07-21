import { batchLimit, firestore, mapDataId } from "@controllers/firebase.server";
import { getTransactions } from "@controllers/paystack.server";
import { sub } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const collectionName = 'transactions'
   const ref = firestore.collection(collectionName);
   const customersRef = firestore.collection("customers");

   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).send("Invalid request headers")
   }

   switch (req.method) {
      case "POST": {
         try {
            console.log("Fetching Paystack transactions")
            const transactions = await getTransactions();
            console.log("Fetching Firebase customers")
            const firebaseCustomers = await customersRef.get()

            if (!firebaseCustomers.size) {
               return res.status(400).send("Customers have not been seeded yet.")
            }

            //Bring ID's forward to avoid further multiple loops 
            const firebaseCustomersData = firebaseCustomers.docs.reduce((acc, curr) => {
               acc[curr.id] = curr
               return acc
            }, {} as _Object)

            //Firebase batch only allows 500 writes per request
            //Split data into chunks
            let seededCount = 0
            const batchCount = Math.ceil(transactions.data.length / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = transactions.data.slice(start, end)
               console.log("*".repeat(30))
               console.log({ start, end })

               for (const trx of chunk) {
                  trx['updatedAt'] = new Date().toISOString()
                  const customer = firebaseCustomersData[trx.customer.id]

                  if (customer?.id) {
                     console.log(`Adding ${trx.customer.email}...`)
                     trx['customer'] = customer.id
                     //populate firebase with data
                     batch.set(ref.doc(String(trx.id)), trx);
                     seededCount++
                  }
               }

               //Commit chunk
               console.log("** Committing batch **")
               await batch.commit()
            }

            console.log("**** Success ****")

            return res.json({
               status: "success",
               message: `${seededCount} ${collectionName} were seeded successfully`
            });

         } catch (error) {
            console.log(error)
            return res.status(400).send(`Could not seed ${collectionName}`)
         }
      }

      case "DELETE": {
         console.log(`** Fetching ${collectionName} **`)
         const timestamp = sub(new Date(), { months: 12 }).toISOString()
         const transactions = await ref.where('paid_at', '<', timestamp).get()
         const dummy = await ref.where('dummy', '==', true).get()
         console.log(`** Fetched ${transactions.size} records, ${dummy.size} dummy records **`)

         /**
          * Delete incomplete dummy data entered during collection creation
          */
         if (dummy.size) {
            const dummyBatch = firestore.batch()
            dummy.forEach(d => dummyBatch.delete(d.ref))
            await dummyBatch.commit()
            console.log(`** Deleted ${dummy.size} ${collectionName} dummy data **`)
         }

         if (transactions.size) {
            const batchCount = Math.ceil(transactions.size / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()//Must be initialised here on every new batch iteration
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = transactions.docs.slice(start, end)

               for (const snapshot of chunk) {
                  console.log("deleting", snapshot.id)
                  batch.delete(snapshot.ref)
               }

               console.log("** Comitting batch **")
               await batch.commit()
            }

            return res.send(`${transactions.size} invalid ${collectionName} were removed`)
         }

         return res.status(404).json("Not found")
      }

      default: {
         return res.status(500).json("Invalid request method")
      }
   }
}
