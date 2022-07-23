import { batchLimit, firestore, removeDummyRecords } from "@controllers/firebase.server";
import { getPlans } from "@controllers/paystack.server";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const collectionName = 'plans'
   const ref = firestore.collection(collectionName);

   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).send("Invalid request headers")
   }

   switch (req.method) {
      case "POST": {
         try {
            console.log(`** Fetching Paystack ${collectionName} **`)
            const plans = await getPlans<Partial<PaystackPlan>>()
            console.log(`** Fetched ${plans.data.length} ${collectionName} **`)

            //Firebase batch only allows 500 writes per request
            //Split data into chunks
            const batchCount = Math.ceil(plans.data.length / batchLimit)

            for (let i = 0; i < batchCount; i++) {
               const batch = firestore.batch()
               const [start, end] = [i * batchLimit, batchLimit * (i + 1)]
               const chunk = plans.data.slice(start, end)
               console.log("*".repeat(50))
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

            return res.json({
               status: "success",
               message: `${plans.data.length} ${collectionName} were seeded successfully`
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
