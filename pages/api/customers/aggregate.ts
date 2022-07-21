import { firestore } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      const collectionName = 'transactions'
      const ref = firestore.collection(collectionName)

      switch (req.method) {
         case "GET": {
            console.log(`** Fetching ${collectionName}... **`)
            const customerID = req.query.id as string
            if (!customerID) {
               const message = `Invalid customer_id [id] parameter.`
               throw new Error(message)
            }
            const snapshot = await ref.where('customer', '==', customerID).get()

            const { startDate, investment, liquidation, interest, balance, total } = {} as _Object
            const [investmentData, liquidationData] = [[], []]

            const responseData = snapshot.docs
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