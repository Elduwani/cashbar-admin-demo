import type { ActionFunction, LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { createPlan, getPlans } from "@controllers/paystack.server";

//handle GET request
export const loader: LoaderFunction = async () => {
   const responseData = await getPlans()

   //return firebase data
   return json(responseData.data, 200);
}

export const action: ActionFunction = async ({ request }) => {
   switch (request.method) {
      case "POST": {
         const response = await createPlan(request.body as any)
         return json(response.data, 200);
      }
      case "DELETE": {
         /* handle "DELETE" */
      }
   }
}