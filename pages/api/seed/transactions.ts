import { firestore, mapDataId } from "@controllers/firebase.server";
import { getTransactions } from "@controllers/paystack.server";
import { sub } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next/types";

const ref = firestore.collection("transactions");
const customersRef = firestore.collection("customers");

//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).send("Invalid request headers")
   }

   const batchLimit = 500

   switch (req.method) {
      case "GET": {
         const snapshot = await ref.get()
         const responseData = snapshot.docs.map(mapDataId)
         return res.send(responseData)
      }

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
            const firebaseCustomersData = firebaseCustomers.docs.map(mapDataId).reduce((acc, curr) => {
               acc[curr.paystack_id] = curr
               return acc
            }, {})

            //Firebase batch only allows 500 writes per request
            //Split data into chunks
            let seededCount = 0
            const batchCount = Math.ceil(transactions.data.length / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = transactions.data.slice(start, end)
               console.log({ start, end })

               for (const trx of chunk) {
                  //map data and remove id field
                  trx['paystack_id'] = trx.id
                  trx['updatedAt'] = new Date().toISOString()
                  delete (trx as Partial<typeof trx>).id

                  const currentCustomer = firebaseCustomersData[trx.customer.id]

                  if (currentCustomer?.id) {
                     console.log(`Adding ${trx.customer.email}...`)
                     trx['customer'] = currentCustomer.id
                     //populate firebase with data
                     batch.set(ref.doc(), trx);
                     seededCount++
                  }
               }

               //Commit chunk
               await batch.commit()
            }

            return res.json({
               status: "success",
               message: `${seededCount} transactions were seeded successfully`
            });

         } catch (error) {
            console.log(error)
            return res.status(400).send("Could not seed transactions")
         }
      }

      case "DELETE": {
         console.log("** Fetching records **")
         const timestamp = sub(new Date(), { months: 12 }).toISOString()
         const transactions = await ref.where('paid_at', '<', timestamp).get()
         console.log(`** Fetched ${transactions.size} records **`)

         /**
          * Delete incomplete dummy data entered during collection creation
            if (!data.reference || !data.customer) {
               console.log("deleting invalid entry", data.id)
               batch.delete(snapshot.ref)
               count++
            }
          */

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

               await batch.commit()
            }

            return res.status(400).json(`${transactions.size} invalid documents were removed`)
         }

         return res.status(404).json("Not found")
      }
   }
}
