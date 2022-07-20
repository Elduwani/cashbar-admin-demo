import CustomersSidebar from "layouts/customers/Customers.sidebar";

export default function CustomerView() {
   return (
      <div className="flex h-full">
         <div className="w-full max-w-md">
            <CustomersSidebar />
         </div>
         <div className="bg-teal-50 w-full grid place-content-center text-center">
            <p className="opacity-50">Illustration</p>
            <p>Select a customer to preview</p>
         </div>
      </div>
   );
}