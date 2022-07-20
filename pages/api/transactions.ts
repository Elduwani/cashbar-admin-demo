import { firestore, mapDataId } from "@controllers/firebase.server";
import { dateFilterOptions, getPastDate } from "@utils/chart.utils";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const time_period = req.query.time_period as typeof dateFilterOptions[number]

   if (!dateFilterOptions.includes(time_period)) {
      return res.status(400).json(`Invalid [time_period] parameter. Options are <${dateFilterOptions.join(' : ')}>`)
   }

   try {
      const date = getPastDate(time_period)

      const transactionsRef = await firestore.collection("transactions")
         .where('paid_at', '>', date.value)
         .get()
      // const liquidationsRef = await firestore.collection("liquidations")
      //    .where('paid_at', '>', date.value)
      //    .where('validated', '==', true)
      //    .get()
      // const expensesRef = await firestore.collection("expenses")
      //    .where('paid_at', '>', date.value)
      //    .where('validated', '==', true)
      //    .get()
      switch (req.method) {
         case "GET": {
            const responseData = {
               transactions: transactionsRef.docs.map(mapDataId),
               // liquidations: liquidationsRef.docs.map(mapDataId),
               // expenses: expensesRef.docs.map(mapDataId)
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