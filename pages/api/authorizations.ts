import { getAuthorizationTokens } from "@controllers/transactions.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   switch (req.method) {
      case "GET": {
         const responseData = await getAuthorizationTokens(req.query.id as string)
         console.log(responseData)
         return res.send(responseData)
      }

      default: {
         return res.status(404).json("Invalid request method")
      }
   }

}