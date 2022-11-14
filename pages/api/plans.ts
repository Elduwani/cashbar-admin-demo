import { createPlan, getAllPlans, getPlanLiquidations, getPlanSubscriptions, updatePlan } from "@controllers/subscriptions.server";
import { zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            const { id } = req.query

            if (id) {
               const subscriptions = await getPlanSubscriptions(id as string)
               const liquidations = await getPlanLiquidations(id as string)
               const total_liquidation = liquidations.reduce((acc, curr) => acc += curr.amount, 0)
               const responseData: PlanDetails = {
                  subscriptions,
                  liquidations,
                  total_liquidation
               }
               return res.send(responseData)

            } else {
               const plans = await getAllPlans()
               return res.send(plans)
            }
         }

         case "POST": {
            const responseData = await createPlan(req.body)
            console.log("Created Plan Response:", responseData)
            return res.send(responseData)
         }

         case "PUT": {
            const responseData = await updatePlan(req.body)
            console.log("Updated Plan Response:", responseData)
            return res.send(responseData)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      const message = zodError(error.issues) ?? error.message
      console.log(message)
      console.log(error?.response?.data)
      return res.status(400).send(message)
   }

}