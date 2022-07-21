// import { collection, doc, getDocs, writeBatch } from "firebase-admin/firestore";
import { firestore } from "@controllers/firebase.server";
import { getCustomers } from "@controllers/paystack.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const collectionName = 'customers'
   //TODO: return appropriate response
   if (req.headers["x-seed-records"] !== process.env.SEED_SECRET) {
      return res.status(400).json("Invalid request headers")
   }

   switch (req.method) {
      case "GET": {
         //return customers
         return res.send(null)
      }

      case "POST": {
         try {
            const batch = firestore.batch()
            const ref = firestore.collection('collectionName')
            console.log("** Fetching customers **")
            const customers = await getCustomers();

            for (const customer of customers.data) {
               //map data and use current id as id field
               customer['updatedAt'] = new Date().toISOString()
               //populate firebase with data
               console.log(`Adding ${customer.email}...`)
               batch.set(ref.doc(String(customer.id)), customer)
            }

            console.log("** Committing batch **")
            await batch.commit()

            return res.send({
               status: "success",
               message: `${customers.data.length} customers were seeded successfully`,
               data: customers.data.length
            })

         } catch (error: any) {
            console.log(error.message)
            return res.status(400).json("Could not seed customers")
         }
      }

      case "DELETE": {
         /**
          * Delete incomplete dummy data entered during collection creation
          */
         const dummy = await firestore.collection(collectionName).where('dummy', '==', true).get()
         if (dummy.size) {
            const dummyBatch = firestore.batch()
            dummy.forEach(d => dummyBatch.delete(d.ref))
            await dummyBatch.commit()
            console.log(`** Deleted ${dummy.size} dummy data **`)
         }

         res.send(`${dummy.size} ${collectionName} records were deleted`)
      }
   }
}
