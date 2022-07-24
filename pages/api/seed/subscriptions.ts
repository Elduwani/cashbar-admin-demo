import { seedSubscriptions } from "@controllers/seed.server";
import { NextApiRequest, NextApiResponse } from "next/types";


//handle GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).send("Invalid request headers")
   }

   switch (req.method) {
      case "POST": {
         try {
            const response = await seedSubscriptions()
            return res.json(response)

         } catch (error) {
            console.log(error)
            return res.status(400).send(`Could not seed subscriptions`)
         }
      }

      default: {
         return res.status(500).json("Invalid request method")
      }
   }
}
