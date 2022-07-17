import { Outlet } from "@remix-run/react";

export default function JokesRoute() {
   return (
      <div className="p-6">
         <h1 className="">J🤪KES</h1>
         <main>
            <Outlet />
         </main>
      </div>
   );
}