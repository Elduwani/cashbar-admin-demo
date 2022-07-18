import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
// import { collection, doc, getDocs, writeBatch } from "firebase-admin/firestore";
import { firestore, mapDataId } from "@controllers/firebase.server";
import { getCustomers } from "@controllers/paystack.server";


//handle GET request
export const loader: LoaderFunction = async () => {
  const customersRef = firestore.collection('customers')
  const ref = await customersRef.get()
  const data = ref.docs.map(doc => doc.data())
  return json(data);
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
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

        return json({
          status: "success",
          message: `${customers.data.length} customers were seeded successfully`,
          data: customers.data.length
        }, 200);

      } catch (error) {
        return json("Could not seed customers", 400);
      }
    }
    case "PUT": {
      /* handle "PUT" */
    }
  }
}
