import { getTransactionsPeriodic, _firestore } from "@controllers/firebase.server";
import { dateFilterOptions } from "@utils/chart.utils";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      const transactionsRef = _firestore.collection("transactions")

      switch (req.method) {
         case "GET": {
            const time_period = req.query.time_period as typeof dateFilterOptions[number]
            if (!dateFilterOptions.includes(time_period)) {
               const message = `Invalid [time_period] parameter. Options are <${dateFilterOptions.join(' : ')}>`
               throw new Error(message)
            }

            const transactions = await getTransactionsPeriodic(time_period)

            const responseData = {
               transactions,
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