import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { getCustomers } from "~/functions/paystack";

import db, { mapDataId } from "~/functions/firebase";
const ref = collection(db, "customers");

//handle GET request
export const loader: LoaderFunction = async () => {
  const snapshot = await getDocs(ref)
  const responseData = snapshot.docs.map(mapDataId)

  //return firebase data
  return json(responseData, 200);
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      try {
        const batch = writeBatch(db)
        const customers = await getCustomers();

        for (const customer of customers.data) {
          //map data and remove id field
          customer['paystack_id'] = customer.id
          customer['updatedAt'] = new Date().toISOString()
          delete (customer as Partial<typeof customer>).id

          //populate firebase with data
          batch.set(doc(ref), customer);
        }

        //return firebase data
        const snapshot = await getDocs(ref)
        const responseData = snapshot.docs.map(mapDataId)
        return json(responseData, 200);

      } catch (error) {
        return json("Could not seed customers", 400);
      }
    }
    case "PUT": {
      /* handle "PUT" */
    }
  }
}