import { useState, useRef, useEffect } from 'react';
import Search from "@components/Search"
import { useRouter } from 'next/router';
import { useFetch } from '@utils/fetch';
import { queryKeys } from '@configs/reactQueryConfigs';

export default function CustomersSidebar() {
   const router = useRouter()
   const [filteredData, setFilteredData] = useState([])

   const { data: customers, isFetching, isError } = useFetch({
      key: [queryKeys.customers],
      url: `/transactions`,
      placeholderData: []
   })

   if (isError) return (
      <div className="w-full h-full grid place-content-center text-center">
         <p>Could not fetch customers</p>
      </div>
   )

   return (
      <div className="w-full h-full flex flex-col border-r">
         <div className="h-36 space-y-2 pt-6 px-4 border-b flex-shrink-0">
            <h3 className="text-gray-700">Filter by search</h3>
            <Search
               data={filteredData}
               callback={setFilteredData}
               placeholder=": name, email, phone..."
               matchList={["first_name", "last_name"]}
            />
         </div>
         <div className="flush-bottom h-full flex flex-col overflow-y-auto scrollbar divide-y">
            {
               customers.map((customer, i) => {
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

function Customer({ customer }) {
   const ref = useRef<HTMLDivElement>(null)

   let { first_name, last_name, id, email } = customer
   last_name = last_name.length > 10 ? last_name.split(" ")[0] : last_name

   const isSelected = activeCustomer.id === id

   if (isSelected) {
      //For now I really only need to update customer names
      let x = customers.find(c => c.id === id)
      first_name = x.first_name
      last_name = x.last_name
   }

   useEffect(() => {
      if (isSelected) {
         // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
         ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
   }, [isSelected]);

   return (
      <div
         ref={isSelected ? ref : null}
         onClick={() => setActiveCustomer(customer)}
         className={`cursor-pointer p-4 text-sm ${isSelected ? "bg-indigo-600 text-white" : "bg-white text-gray-600"}`}
      >
         <p className="truncate capitalize">
            {`${first_name} ${_last_name}`}
         </p>
         <p className={isSelected ? "text-indigo-200" : undefined}>{email}</p>
      </div>
   );
}
