import getAggregate from "@controllers/aggregates";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   switch (req.method) {
      case "GET": {
         const responseData = await getAggregate()
         return res.send(responseData)
      }

      default: {
         return res.status(404).json("Invalid request method")
      }
   }

}