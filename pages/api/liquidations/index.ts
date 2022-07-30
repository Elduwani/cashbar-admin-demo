import { formatDocumentAmount, _firestore } from "@controllers/firebase.server";
import { GetTrasactionsSchema, PostLiquidationSchema } from "@controllers/schemas.server";
import { createLiquidation } from "@controllers/subscriptions.server";
import { getTimePeriodDate } from "@utils/chart.utils";
import { zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            const { less_than, greater_than, time_period } = req.query as z.infer<typeof GetTrasactionsSchema>
            if (less_than && greater_than && (+less_than <= +greater_than)) {
               throw new Error("greater_than value cannot be same / higher than less_than value")
            }

            const date = getTimePeriodDate(time_period)
            const collectionName: CollectionName = 'liquidations'

            /**
             * Cast this to Query<DocumentData> if it'll be conditionally reassigned
             * 
             * Firebase limitation:
             * Cannot have inequality filters on multiple properties [amount, paid_at]
             * Bummer!
             */
            let snapshot = await _firestore.collection(collectionName)
               .orderBy('paid_at', 'desc')
               .where('paid_at', '>', date.value)
               .get()

            const responseData = snapshot.docs
               .map(d => formatDocumentAmount(d) as Liquidation)
               .filter(d => {
                  if (less_than && d.amount >= +less_than) {
                     return false
                  }
                  if (greater_than && d.amount <= +greater_than) {
                     return false
                  }
                  return true
               })

            return res.send(responseData)
         }

         case "POST": {
            PostLiquidationSchema.parse(req.body)
            const liquidation = await createLiquidation(req.body)
            return res.send(liquidation)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(zodError(error.issues) ?? error.message)
   }

}