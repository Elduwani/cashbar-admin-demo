import { batchLimit, firestore, removeDummyRecords } from "@controllers/firebase.server";
import { getTransactions, verifyTransaction } from "@controllers/paystack.server";
import { NextApiRequest, NextApiResponse } from "next/types";
import { sub } from "date-fns";
import fs from 'fs'
import path from "path";


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
            const paystackTransactions = await getTransactions();
            if (!paystackTransactions.data?.length) {
               throw new Error("No Paystack transactions found")
            }

            //Only seed transactions that are within the last 12 months
            const timestamp = sub(new Date(), { months: 12 })
            const transactions = paystackTransactions.data
               .filter(trx => new Date(trx.paid_at).getTime() > timestamp.getTime())

            //Fetch seeded customers
            console.log("Fetching Firebase customers")
            const firebaseCustomers = await customersRef.get()
            if (!firebaseCustomers.size) {
               throw new Error("Customers have not been seeded yet.")
            }

            //Bring user ID's forward for faster reference 
            const firebaseCustomersData = firebaseCustomers.docs.reduce((acc, curr) => {
               acc[curr.id] = curr
               return acc
            }, {} as _Object)

            //Firebase batch only allows 500 writes per request, so split data into chunks
            let seededCount = 0
            const batchCount = Math.ceil(transactions.length / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = transactions.slice(start, end)
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

            await removeDummyRecords(ref, collectionName)

            console.log("**** Done ****")

            return res.json({
               status: "success",
               message: `${seededCount} ${collectionName} were seeded successfully`
            });

         } catch (error) {
            console.log(error)
            return res.status(400).send(`Could not seed ${collectionName}`)
         }
      }

      case "PUT": {
         /**
          * This function will get the related plan information for all seeded transactions
          * so they can be linked, as Paystack doesn't link transaction to plans unless
          * when said transaction is verified.
          */
         try {

            const dir = path.join(process.cwd(), 'verified_transactions_log.json')
            console.log(`>> Checking content from ${dir}`)
            const verifiedTransactions = JSON.parse(fs.readFileSync(dir, 'utf8'))

            if (verifiedTransactions?.[0]?.plan?.length) {
               console.log(`>> Using local content <<`)
               const batchCount = Math.ceil(verifiedTransactions.length / batchLimit)

               for (let i = 0; i < batchCount; i++) {
                  const batch = firestore.batch()
                  const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
                  const chunk = verifiedTransactions.slice(start, end)
                  console.log("*".repeat(30))
                  console.log({ start, end })

                  for (const trx of chunk) {
                     console.log(`Adding ${trx.id}...`)
                     const dataToMerge = { plan: trx.plan }
                     batch.set(ref.doc(String(trx.id)), dataToMerge, { merge: true })
                  }

                  //Commit chunk
                  console.log("** Committing batch **")
                  await batch.commit()
               }
               console.log("** Done **")

            } else {

               const data = []
               const transactions = await ref.get()
               console.log(`>> Fetched ${transactions.size} transactions <<`)

               if (!transactions.size) {
                  throw new Error("Transactions have not been seeded")
               }

               for (let i = 0; i < transactions.docs.length; i++) {
                  const trx = transactions.docs[i].data()
                  console.log(trx.paid_at)
                  const verifiedTrx = await verifyTransaction(trx.reference)
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

            return res.send("Done")

         } catch (err: any) {
            console.error(err.message)
            return res.status(400).json(err.message)
         }
      }

      default: {
         return res.status(500).json("Invalid request method")
      }
   }
}
