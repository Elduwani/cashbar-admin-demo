// import { collection, doc, getDocs, writeBatch } from "firebase-admin/firestore";
import { seedCustomers } from "@controllers/seed.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   //TODO: return appropriate response
   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).json("Invalid request headers")
   }

   try {

      switch (req.method) {
         case "POST": {
            const response = await seedCustomers()
            return res.send(response)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error.message)
      return res.status(400).json("Could not seed customers")
   }
}
