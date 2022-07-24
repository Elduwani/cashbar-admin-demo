import { getSubscriptionTransactions } from "@controllers/subscriptions.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   /**
    * All subscriptions and plans fetched here are specific to provided customer id,
    * to avoid fetching all records.
    */
   try {
      switch (req.method) {
         case "GET": {
            const [planCode, customerID] = [req.query.plan_code as string, req.query.customer_id as string]
            if (!planCode) throw new Error(`Invalid planCode [plan_code] parameter.`)
            if (!customerID) throw new Error(`Invalid customerID [customer_id] parameter.`)

            const responseData = await getSubscriptionTransactions(planCode, customerID)
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