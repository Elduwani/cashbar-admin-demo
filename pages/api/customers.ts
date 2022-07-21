import { firestore, mapDataId } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      const customerRef = firestore.collection("customers")

      switch (req.method) {
         case "GET": {
            console.log("Fetching customers...")
            const snapshot = await customerRef.get()
            const responseData = snapshot.docs.map(mapDataId)
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