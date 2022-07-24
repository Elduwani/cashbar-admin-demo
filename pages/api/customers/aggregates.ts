import { getCustomerAggregate } from "@controllers/aggregates.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      switch (req.method) {
         case "GET": {
            const customerID = req.query.customer_id as string
            if (!customerID) {
               const message = `Invalid customer_id parameter.`
               throw new Error(message)
            }

            const aggregates = await getCustomerAggregate(+customerID)
            return res.send(aggregates)
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