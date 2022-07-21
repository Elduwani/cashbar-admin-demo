import React, { useState, useRef, useEffect } from 'react';
import Search from "@components/Search"
import { useRouter } from 'next/router';
import { useFetch } from '@utils/fetch';
import { queryKeys } from '@configs/reactQueryConfigs';
import Button from '@components/Button';
import FullPageCenterItems from '@components/FullPageCenterItems';
import Spinner from '@components/Spinner';

export default function CustomersSidebar() {
   const [filteredData, setFilteredData] = useState<Customer[]>([])
   const { data: customers, isFetching, isError } = useFetch({
      key: [queryKeys.customers],
      url: `/customers`,
      placeholderData: []
   })

   const data = filteredData.length ? filteredData : customers

   if (isFetching) return (
      <FullPageCenterItems className="text-center border-r space-y-3 text-gray-500">
         <div className="flex flex-col items-center space-y-3">
            <Spinner />
            <p>Fetching customers</p>
         </div>
      </FullPageCenterItems>
   )

   if (isError) return (
      <FullPageCenterItems className="text-center border-r space-y-3 text-gray-500">
         <p>Could not fetch customers</p>
         <Button variant="teal">Retry</Button>
      </FullPageCenterItems>
   )

   return (
      <div className="w-full h-full flex flex-col border-r">
         <div className="h-36 space-y-2 pt-6 px-4 border-b flex-shrink-0">
            <h3 className="text-gray-700">Search</h3>
            <Search
               data={customers}
               callback={setFilteredData}
               placeholder=": name, email, phone..."
               matchList={["first_name", "last_name"]}
            />
         </div>
         <div className="flush-bottom h-full flex flex-col overflow-y-auto scrollbar divide-y">
            {
               (data as Customer[]).map?.((customer, i) => {
                  return (
                     <Customer
                        customer={customer}
                        key={`key${i}`}
                     />
                  )
               })
            }
         </div>
      </div>
   );
}

function Customer({ customer }: { customer: Customer }) {
   const router = useRouter()
   const ref = useRef<HTMLDivElement>(null)

   let { first_name, last_name, id, email } = customer
   const isSelected = router.query.id === id
   last_name = last_name.length > 10 ? last_name.split(" ")[0] : last_name

   useEffect(() => {
      if (isSelected) {
         ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
   }, [isSelected]);

   return (
      <div
         ref={isSelected ? ref : null}
         onClick={() => router.push(`/customers/${customer.id}`)}
         className={`cursor-pointer p-4 text-sm ${isSelected ? "bg-teal-100 text-teal-900" : "bg-white text-gray-600"}`}
      >
         <p className={`truncate capitalize ${isSelected && 'font-semibold'}`}>
            {`${first_name} ${last_name}`}
         </p>
         <p className={isSelected ? "opacity-70" : undefined}>{email}</p>
      </div>
   );
}
