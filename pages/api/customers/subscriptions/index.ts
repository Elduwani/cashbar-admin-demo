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
            const customer = req.query.customer as string
            if (!customer) throw new Error(`Invalid customer id parameter.`)

            const responseData = await getCustomerSubscriptions(customer)
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