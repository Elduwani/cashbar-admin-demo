import { getAllTransactions } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            const transactions = await getAllTransactions()
            const responseData = {
               transactions,
               liquidations: [],
               expenses: []
            }
            return res.send(responseData)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(error.message)
   }

}