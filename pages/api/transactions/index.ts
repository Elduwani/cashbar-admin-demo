import { formatDocumentAmount, _firestore } from "@controllers/firebase.server";
import { getTimePeriodDate } from "@utils/chart.utils";
import { invalidNumbers, zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from 'zod';

const Schema = z.object({
   less_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   greater_than: z.string().refine((n) => !invalidNumbers([n]), "Invalid number").optional(),
   time_period: z.enum(['1 week', '1 month', '3 months', '6 months']),
   status: z.enum(['success', 'abandoned', 'failed']).default('success'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      Schema.parse(req.query)

      switch (req.method) {
         case "GET": {
            const { less_than, greater_than, time_period } = req.query as z.infer<typeof Schema>
            if (less_than && greater_than && (+less_than <= +greater_than)) {
               throw new Error("greater_than value cannot be same / higher than less_than value")
            }

            const date = getTimePeriodDate(time_period)

            /**
             * Cast this to Query<DocumentData> if it'll be conditionally reassigned
             * 
             * Firebase limitation:
             * Cannot have inequality filters on multiple properties [amount, paid_at]
             * Bummer!
             */
            let snapshot = await _firestore.collection('transactions')
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

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error.message)
      return res.status(400).send(zodError(error.issues) ?? error.message)
   }

}