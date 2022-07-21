import CustomersSidebar from '@layouts/customers/Customers.sidebar'
import React from 'react'

export function CustomersLayout({ children }: { children: React.ReactElement }) {
   return (
      <div className="flex h-full">
         <div className="w-full max-w-xs">
            <CustomersSidebar />
         </div>
         {children}
      </div>
   )
}