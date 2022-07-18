import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { firestore, mapDataId } from "@controllers/firebase.server";
import { getTransactions } from "@controllers/paystack.server";

const ref = firestore.collection("transactions");
const customersRef = firestore.collection("customers");

//handle GET request
export const loader: LoaderFunction = async () => {
   const snapshot = await ref.get()
   const responseData = snapshot.docs.map(mapDataId)

   //return firebase data
   return json(responseData);
}

export const action: ActionFunction = async ({ request }) => {
   switch (request.method) {
      case "POST": {
         if (request.headers.get("x-seed-records") === "1") {
            try {
               console.log("Fetching Paystack transactions")
               const transactions = await getTransactions();
               console.log("Fetching Firebase customers")
               const firebaseCustomers = await customersRef.get()

               if (!firebaseCustomers.size) {
                  return json("Customers have not been seeded yet.")
               }

               //Bring ID's forward to avoid further multiple loops 
               const firebaseCustomersData = firebaseCustomers.docs.map(mapDataId).reduce((acc, curr) => {
                  acc[curr.paystack_id] = curr
                  return acc
               }, {})

               //Firebase batch only allows 500 writes per request
               //Split data into chunks
               let seededCount = 0
               const chunkLimit = 500
               const batchCount = Math.ceil(transactions.data.length / chunkLimit)

               for (let i = 0; i < batchCount; i++) {
                  const batch = firestore.batch()
                  const [start, end] = [i * chunkLimit, chunkLimit * (i + 1)]
                  const chunk = transactions.data.slice(start, end)
                  console.log({ start, end })

                  for (const trx of chunk) {
                     //map data and remove id field
                     trx['paystack_id'] = trx.id
                     trx['updatedAt'] = new Date().toISOString()
                     delete (trx as Partial<typeof trx>).id

                     const currentCustomer = firebaseCustomersData[trx.customer.id]

                     if (currentCustomer?.id) {
                        console.log(`Adding ${trx.customer.email}...`)
                        trx['customer'] = currentCustomer.id
                        //populate firebase with data
                        batch.set(ref.doc(), trx);
                        seededCount++
                     }
                  }

                  //Commit chunk
                  await batch.commit()
               }

               return json({
                  status: "success",
                  message: `${seededCount} transactions were seeded successfully`
               });

            } catch (error) {
               console.log(error)
               return json("Could not seed transactions", 400);
            }
         }

         return json("Invalid request headers", 400)
      }
   }
}