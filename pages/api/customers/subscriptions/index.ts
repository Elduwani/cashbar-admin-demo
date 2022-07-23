import { firestore, formatDocumentAmount } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   /**
    * All subscriptions and plans fetched here are specific to provided customer id,
    * to avoid fetching all records.
    */
   try {
      const collectionName: Collection = 'subscriptions'
      const subsRef = firestore.collection(collectionName)

      switch (req.method) {
         case "GET": {
            console.log(`>> Fetching ${collectionName}... <<`)
            const customerID = req.query.customer_id as string
            if (!customerID) throw new Error(`Invalid customer_id [customer_id] parameter.`)

            const subscriptionsSnapshot = await subsRef.where('customer', '==', +customerID).get()
            const sortRank: PaystackSubscription['status'][] = ['active', 'complete', 'cancelled']

            //Get an array of document refs of all related plans
            const plansRefs = subscriptionsSnapshot.docs.map(d => firestore.doc('plans/' + d.data().plan))
            const plansSnaphot = await firestore.getAll(...plansRefs)
            //Denormalize plans for easy reference
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

            return res.send(responseData)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(error.message)
   }
}