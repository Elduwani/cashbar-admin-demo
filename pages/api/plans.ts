import { getAllPlans } from "@controllers/subscriptions.server";
import { zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            const plans = await getAllPlans()
            return res.send(plans)
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