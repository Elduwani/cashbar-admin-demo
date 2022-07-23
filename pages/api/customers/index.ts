import { firestore } from "@controllers/firebase.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   try {
      const customerRef = firestore.collection("customers")

      switch (req.method) {
         case "GET": {
            console.log("Fetching customers...")
            const snapshot = await customerRef.orderBy('first_name', 'asc').get()
            const responseData = snapshot.docs.map(d => d.data())
            return res.send(responseData)
         }

         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      return res.status(400).send(error.message)
   }

}