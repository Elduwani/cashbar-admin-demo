import { seedPlans, verifyHeaders } from "@controllers/seed.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      verifyHeaders(req)

      switch (req.method) {
         case "POST": {
            const response = await seedPlans()
            return res.json(response);
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }
   } catch (error: any) {
      console.log(error.message)
      return res.status(400).send(`Could not seed plans. \n ${error.message}`)
   }
}
