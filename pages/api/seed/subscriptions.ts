import { seedSubscriptions, verifyHeaders } from "@controllers/seed.server";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      verifyHeaders(req)

      switch (req.method) {
         case "POST": {
            const response = await seedSubscriptions()
            return res.json(response)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }
   } catch (error: any) {
      console.log(error)
      return res.status(400).send(`Could not seed subscriptions. \n ${error.message}`)
   }
}
