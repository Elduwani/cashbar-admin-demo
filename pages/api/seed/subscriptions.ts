import { firestore, removeDummyRecords } from "@controllers/firebase.server";
import { getPlans, getSubscriptions } from "@controllers/paystack.server";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const batchLimit = 500
   const collectionName = 'subscriptions'
   const ref = firestore.collection(collectionName);

   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).send("Invalid request headers")
   }

   switch (req.method) {
      case "POST": {
         try {
            console.log(`** Fetching Paystack ${collectionName} **`)
            const subscriptions = await getSubscriptions()

            //Firebase batch only allows 500 writes per request
            //Split data into chunks
            const batchCount = Math.ceil(subscriptions.data.length / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = subscriptions.data.slice(start, end)
               console.log("*".repeat(50))
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

            return res.json({
               status: "success",
               message: `${subscriptions.data.length} ${collectionName} were seeded successfully`
            });

         } catch (error) {
            console.log(error)
            return res.status(400).send(`Could not seed ${collectionName}`)
         }
      }

      default: {
         return res.status(500).json("Invalid request method")
      }
   }
}
