import { _firestore } from "@controllers/firebase.server";
import { getLiquidationsPeriodic } from "@controllers/subscriptions.server";
import { getTransactionsPeriodic } from "@controllers/transactions";
import { timePeriodOptions } from "@utils/chart.utils";
import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            const Schema = z.object({
               time_period: z.enum(timePeriodOptions).default('1 week')
            })
            Schema.parse(req.query)

            const { time_period } = req.query as z.infer<typeof Schema>
            const liquidations = await getLiquidationsPeriodic(time_period)
            return res.send(liquidations)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(error.message)
   }
}