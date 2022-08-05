import { formatDocumentAmount, _firestore } from "@controllers/firebase.server";
import { GetTrasactionsSchema, PostExpenseSchema, PostLiquidationSchema } from "@controllers/schemas.server";
import { createExpense } from "@controllers/transactions.server";
import { getTimePeriodDate } from "@utils/chart.utils";
import { zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {


      switch (req.method) {
         case "GET": {

            GetTrasactionsSchema.parse(req.query)

            const { less_than, greater_than, time_period } = req.query as z.infer<typeof GetTrasactionsSchema>
            if (less_than && greater_than && (+less_than <= +greater_than)) {
               throw new Error("greater_than value cannot be same / higher than less_than value")
            }

            const date = getTimePeriodDate(time_period)
            const collectionName: CollectionName = 'expenses'

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
               .map(d => formatDocumentAmount(d))
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

         case 'POST': {
            PostExpenseSchema.parse(req.body)
            const expense = await createExpense(req.body)
            return res.send(expense)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      const message = zodError(error.issues) ?? error.message
      console.log(message)
      return res.status(400).send(message)
   }

}