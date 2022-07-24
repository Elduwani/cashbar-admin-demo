import { linkTransactionsToPlans, seedTransactions, verifyHeaders } from "@controllers/seed.server";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      verifyHeaders(req)

      switch (req.method) {
         case "POST": {
            const response = await seedTransactions()
            return res.json(response);
         }

         case "PUT": {
            const response = await linkTransactionsToPlans()
            return res.send(response)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error.message)
      return res.status(400).send(`error.message. \n ${error.message}`)
   }
}
