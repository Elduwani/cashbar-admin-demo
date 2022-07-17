import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getCustomers } from "~/functions/paystack";

import db from "~/functions/firebase";
const customersRef = collection(db, "customers");

//handle GET request
export const loader: LoaderFunction = async () => {
  const snapshot = await getDocs(customersRef)
  const responseData = snapshot.docs.map(mapCustomer)

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
          batch.set(doc(customersRef), customer, { merge: true });
        }

        //return firebase data
        const snapshot = await getDocs(customersRef)
        const responseData = snapshot.docs.map(mapCustomer)
        return json(responseData, 200);

      } catch (error) {
        return json("Could not seed customers", 400);
      }
    }
    case "PUT": {
      /* handle "PUT" */
    }
    case "PATCH": {
      /* handle "PATCH" */
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};

function mapCustomer(doc: QueryDocumentSnapshot<DocumentData>) {
  const data = doc.data()
  data.id = doc.id
  return data
}