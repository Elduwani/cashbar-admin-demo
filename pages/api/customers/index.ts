import { getFirebaseCustomers } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      switch (req.method) {
         case "GET": {
            const responseData = await getFirebaseCustomers()
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