import { firestore, formatDocumentAmount } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   /**
    * All subscriptions and plans fetched here are specific to provided customer id,
    * to avoid fetching all records.
    */
   try {
      const collectionName: Collection = 'transactions'
      const ref = firestore.collection(collectionName)

      switch (req.method) {
         case "GET": {
            console.log(`>> Fetching ${collectionName} <<`)
            const [planCode, customerID] = [req.query.plan_code as string, req.query.customer_id as string]
            if (!planCode) throw new Error(`Invalid planCode [plan_code] parameter.`)
            if (!customerID) throw new Error(`Invalid customerID [customer_id] parameter.`)

            const transactionsRef = await ref
               .where('customer', '==', customerID)
               .where("plan", "==", planCode)
               .get()

            const responseData = transactionsRef.docs.map(d => formatDocumentAmount(d))

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