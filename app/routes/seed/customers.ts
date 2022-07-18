import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
// import { collection, doc, getDocs, writeBatch } from "firebase-admin/firestore";
import db, { mapDataId } from "@controllers/firebase.server";
import { getCustomers } from "@controllers/paystack.server";

// const ref = db.ref("customers");

//handle GET request
export const loader: LoaderFunction = async () => {
  console.log('called...')
  const ref = db.database().ref("customers")
  console.log(db)
  // let response

  ref.on("value", (snapshot) => {
    console.log("inner");
    console.log(snapshot.val());
  }, (error) => console.log(error));

  // ref.off()
  return json(null);

  // const snapshot = await getDocs(ref)
  // const responseData = snapshot.docs.map(mapDataId)
  // return firebase data
}

// export const action: ActionFunction = async ({ request }) => {
//   switch (request.method) {
//     case "POST": {
//       try {
//         const batch = writeBatch(db)
//         const customers = await getCustomers();

//         for (const customer of customers.data) {
//           //map data and remove id field
//           customer['paystack_id'] = customer.id
//           customer['updatedAt'] = new Date().toISOString()
//           delete (customer as Partial<typeof customer>).id

//           //populate firebase with data
//           batch.set(doc(ref), customer);
//         }

//         await batch.commit()

//         //return firebase data
//         const snapshot = await getDocs(ref)
//         const responseData = snapshot.docs.map(mapDataId)
//         return json({
//           status: "success",
//           message: `${customers.data.length} customers were seeded successfully`,
//           data: responseData
//         }, 200);

//       } catch (error) {
//         return json("Could not seed customers", 400);
//       }
//     }
//     case "PUT": {
//       /* handle "PUT" */
//     }
//   }
// }
