import Button from "@components/Button";
import CustomersLayout from "@layouts/customers/Customers.layout";
import TabsList from "@components/TabsList";
import { useModal } from "@contexts/Modal.context";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import { FiPhone, FiMapPin, FiMail } from "react-icons/fi";
import { queryKeys } from "@configs/reactQueryConfigs";
import { useFetch } from "@utils/fetch";
import Avatar from "@components/Avatar";

export default function Customer() {
   const router = useRouter()
   const { openModal } = useModal()
   const [tabIndex, setTabIndex] = useState(0)

   const { data: customers } = useFetch({
      key: [queryKeys.customers],
      url: `/customers`,
      placeholderData: []
   })

   const tabs: _Tab[] = [
      { name: "overview", route: '' },
      { name: "subscriptions", route: '' },
      { name: "settings", route: '' }
   ]

   const activeCustomer = (customers as Customer[])?.find(c => c.id === router.query.id)

   if (activeCustomer?.id) {
      let { first_name, last_name, phone, email, metadata } = activeCustomer
      last_name = last_name.length > 15 ? last_name.split(" ")[0] : last_name

      return (
         <div className="w-full flex-1 overflow-y-auto scrollbar min-w[800px]">
            <div className="h-40 px-6 pt-6 flex flex-col border-b bg-white">
               <div className="flex flex-1 flex-shrink-0">
                  <Avatar name={first_name} />
                  <div className="space-y-1 pl-4">
                     <h1 className="text-2xl font-medium text-gray-600 capitalize">{`${first_name} ${last_name}`}</h1>
                     <div className="flex space-x-4">
                        {phone ? <div className="flex space-x-2 items-center text-gray-600 text-sm">
                           <FiPhone className="text-gray-400" /><span>{phone}</span>
                        </div> : null}
                        {metadata?.state ? <div className="flex space-x-2 items-center text-gray-600 text-sm capitalize">
                           <FiMapPin className="text-gray-400" /><span>{metadata.state}</span>
                        </div> : null}
                        <div className="flex space-x-2 items-center text-gray-600 text-sm">
                           <FiMail className="text-gray-400" /><span>{email}</span>
                        </div>
                     </div>
                  </div>
                  <div className="ml-auto">
                     <Button variant="teal" onClick={() => openModal({ name: "addTransaction", data: {} })}>Add Record</Button>
                  </div>
               </div>

               <TabsList tabs={tabs} setIndex={setTabIndex} key={email} index={tabIndex} />

            </div>
            <NestedChildren />
         </div>
      )
   }

   return (
      <div className="w-full flex-1 bg-slate-100 grid place-content-center text-center">
         <div className="w-full max-w-xs space-y-4">
            <p className="text-xl">Booooooooot!</p>
            <p className="opacity-70">We could not find this customer. Please select a customer on the left.</p>
         </div>
      </div>
   )
}

function NestedChildren() {
   const { tab } = useRouter().query

   let child = null
   return child
}

Customer.getLayout = function getLayout(page: ReactElement) {
   return (
      <>
         <CustomersLayout>
            {page}
         </CustomersLayout>
      </>
   )
}

//Simply exporting this will ensure useRouter isn't empty on initial render
export const getServerSideProps: GetServerSideProps = async (context) => {
   return {
      props: {}
   }
}