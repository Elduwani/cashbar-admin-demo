// import { collection, doc, getDocs, writeBatch } from "firebase-admin/firestore";
import { firestore } from "@controllers/firebase.server";
import { getCustomers } from "@controllers/paystack.server";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const ref = firestore.collection('customers')
        const customers = await getCustomers();

        for (const customer of customers.data) {
          //map data and remove id field
          customer['paystack_id'] = customer.id
          customer['updatedAt'] = new Date().toISOString()
          delete (customer as Partial<typeof customer>).id

          //populate firebase with data
          batch.set(ref.doc(), customer)
          console.log(`Added ${customer.email}`)
        }

        await batch.commit()

        return res.send({
          status: "success",
          message: `${customers.data.length} customers were seeded successfully`,
          data: customers.data.length
        })

      } catch (error) {
        return res.status(400).json("Could not seed customers")
      }
    }

    case "PUT": {
      /* handle "PUT" */
    }
  }
}
