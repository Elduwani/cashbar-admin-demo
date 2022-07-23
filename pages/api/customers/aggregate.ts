import { firestore } from "@controllers/firebase.server";
import { formatBaseCurrency, mapDataAmount } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      const collectionName: Collection = 'transactions'
      const trxRef = firestore.collection(collectionName)

      switch (req.method) {
         case "GET": {
            console.log(`>> Fetching ${collectionName}... <<`)
            const customerID = req.query.id as string
            if (!customerID) {
               const message = `Invalid customer_id [id] parameter.`
               throw new Error(message)
            }
            const snapshot = await trxRef.where('customer', '==', +customerID).get()
            const total_investment = snapshot.docs.reduce((acc, curr) => acc += curr.data().amount, 0)
            const total_liquidation = 0

            return res.send({
               total_investment: formatBaseCurrency(total_investment),
               total_interest: formatBaseCurrency(0), //TODO
               total_liquidation: formatBaseCurrency(total_liquidation),
               startDate: new Date().toISOString(),
               balance: formatBaseCurrency(total_investment - total_liquidation), //TODO minus liquidation
               transactions: snapshot.docs.map(mapDataAmount).reverse(),
               liquidations: []
            })
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(error.message)
   }
}