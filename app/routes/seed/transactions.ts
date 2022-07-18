import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { getTransactions } from "~/functions/paystack";

import db, { mapDataId } from "~/functions/firebase";
const ref = collection(db, "transactions");
const customersRef = collection(db, "customers");

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
            const transactions = await getTransactions();
            const firebaseCustomers = await getDocs(customersRef)
            const firebaseCustomersData = firebaseCustomers.docs.map(mapDataId).reduce((acc, curr) => {
               acc[curr.paystack_id] = curr
               return acc
            }, {})

            let print = true
            const batch = writeBatch(db)

            for (const trx of transactions.data) {
               //map data and remove id field
               trx['paystack_id'] = trx.id
               trx['updatedAt'] = new Date().toISOString()
               delete (trx as Partial<typeof trx>).id

               const currentCustomer = firebaseCustomersData[trx.customer.id]

               if (currentCustomer?.id) {
                  trx['customer'] = currentCustomer.id
                  if (print) {
                     console.log(trx.customer, currentCustomer?.id)
                     print = false
                  }
                  //populate firebase with data
                  // console.log("Writing", currentCustomer.id, trx.paystack_id)
                  // batch.set(doc(ref), trx);
                  continue
               }

               console.log(`Firebase customer not found for ${trx.customer.email}`)
            }

            //return firebase data
            // const snapshot = await getDocs(ref)
            // const responseData = snapshot.docs.map(mapDataId)
            return json({}, 200);

         } catch (error) {
            console.log(error)
            return json("Could not seed transactions", 400);
         }
      }
   }
}