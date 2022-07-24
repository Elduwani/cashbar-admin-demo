import { getCustomerSubscriptions } from "@controllers/subscriptions.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   /**
    * All subscriptions and plans fetched here are specific to provided customer id,
    * to avoid fetching all records.
    */
   try {
      switch (req.method) {
         case "GET": {
            const customerID = req.query.customer_id as string
            if (!customerID) throw new Error(`Invalid customer_id [customer_id] parameter.`)

            const responseData = await getCustomerSubscriptions(+customerID)
            return res.send(responseData)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error)
      return res.status(400).send(error.message)
   }
}