import { PostLiquidationSchema } from "@controllers/schemas.server";
import { createLiquidation } from "@controllers/subscriptions.server";
import { zodError } from "@utils/index";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {

      switch (req.method) {
         case "GET": {
            return res.send([])
         }

         case "POST": {
            PostLiquidationSchema.parse(req.body)
            const liquidation = await createLiquidation(req.body)
            return res.status(400).send(liquidation)
         }

         default: {
            return res.status(404).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(zodError(error.issues) ?? error.message)
   }

}