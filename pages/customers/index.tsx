import { CustomersLayout } from "@layouts/customers/Customers.layout";
import { ReactElement } from "react";

export default function CustomerPage() {
   return (
      <section className="bg-slate-100 w-full grid place-content-center text-center">
         <p className="opacity-50">Illustration</p>
         <p>Select a customer to preview</p>
      </section>
   );
}

CustomerPage.getLayout = function getLayout(page: ReactElement) {
   return (
      <CustomersLayout>
         {page}
      </CustomersLayout>
   )
}
