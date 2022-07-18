// import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
// import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
// import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
// import db, { mapDataId } from "@controllers/firebase.server";
// import { getTransactions } from "@controllers/paystack.server";

// const ref = collection(db, "transactions");
// const customersRef = collection(db, "customers");

// //handle GET request
// export const loader: LoaderFunction = async () => {
//    const snapshot = await getDocs(ref)
//    const responseData = snapshot.docs.map(mapDataId)

//    //return firebase data
//    return json(responseData, 200);
// }

// export const action: ActionFunction = async ({ request }) => {
//    switch (request.method) {
//       case "POST": {
//          try {
//             const transactions = await getTransactions();
//             const firebaseCustomers = await getDocs(customersRef)

//             //Bring ID's forward to avoid further multiple loops 
//             const firebaseCustomersData = firebaseCustomers.docs.map(mapDataId).reduce((acc, curr) => {
//                acc[curr.paystack_id] = curr
//                return acc
//             }, {})

//             //Firebase batch only allows 500 writes per request
//             //Split data into chunks
//             let seededCount = 0
//             const chunkLimit = 500
//             const batchCount = Math.ceil(transactions.data.length / chunkLimit)

//             for (let i = 0; i < batchCount; i++) {
//                const batch = writeBatch(db)
//                const [start, end] = [i * chunkLimit, chunkLimit * (i + 1)]
//                const chunk = transactions.data.slice(start, end)

//                for (const trx of chunk) {
//                   //map data and remove id field
//                   trx['paystack_id'] = trx.id
//                   trx['updatedAt'] = new Date().toISOString()
//                   delete (trx as Partial<typeof trx>).id

//                   const currentCustomer = firebaseCustomersData[trx.customer.id]

//                   if (currentCustomer?.id) {
//                      trx['customer'] = currentCustomer.id
//                      //populate firebase with data
//                      batch.set(doc(ref), trx);
//                      seededCount++
//                      continue
//                   }

//                   console.log(`Firebase customer not found for ${trx.customer.email}`)
//                }

//                //Commit chunk
//                await batch.commit()
//             }

//             return json({
//                status: "success",
//                message: `${seededCount} transactions were seeded successfully`
//             }, 200);

//          } catch (error) {
//             console.log(error)
//             return json("Could not seed transactions", 400);
//          }
//       }
//    }
// }