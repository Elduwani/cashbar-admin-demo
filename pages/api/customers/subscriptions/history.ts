import { GetSubscriptionsHistorySchema } from "@controllers/schemas.server";
import { getSubscriptionAnalysis } from "@controllers/subscriptions.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   /**
    * All subscriptions and plans fetched here are specific to provided customer id,
    * to avoid fetching all records.
    */
   try {
      switch (req.method) {
         case "GET": {

            GetSubscriptionsHistorySchema.parse(req.query)

            const [plan, customer] = [req.query.plan as string, req.query.customer as string]
            const response = await getSubscriptionAnalysis(plan, customer)
            return res.send(response)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error.message)
      return res.status(400).send(error.message)
   }
}