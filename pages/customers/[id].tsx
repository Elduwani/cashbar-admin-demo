import Button from "@components/Button";
import CustomersLayout from "@layouts/customers/Customers.layout";
import TabsList from "@components/TabsList";
import { useModal } from "@contexts/Modal.context";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import { FiPhone, FiMapPin, FiMail } from "react-icons/fi";

export default function Customer() {
   const router = useRouter()
   const { openModal } = useModal()
   const [tabIndex, setTabIndex] = useState(0)

   const tabs: _Tab[] = [
      { name: "overview", route: '' },
      { name: "subscriptions", route: '' },
      { name: "settings", route: '' }
   ]

   const activeCustomer = {
      id: '234jcnjn',
      first_name: 'elduwani',
      last_name: 'owologba',
      phone: '09784678283',
      email: 'elduwani@gmail.com',
      state: 'lagos'
   }

   const { first_name, last_name, phone, email, state } = activeCustomer
   return (
      <div className="w-full flex-1 overflow-y-auto scrollbar min-w[800px]">
         <div className="h-40 px-6 pt-6 flex flex-col border-b bg-white">
            <div className="flex flex-1 flex-shrink-0">
               <div className="avatar uppercase flex-shrink-0">{first_name.split("")[0]}</div>
               <div className="space-y-1">
                  <h1 className="text-2xl font-medium text-gray-600 capitalize">{`${first_name} ${last_name.length > 15 ? last_name.split(" ")[0] : last_name}`}</h1>
                  <div className="flex space-x-4">
                     {phone ? <div className="flex space-x-2 items-center text-gray-600 text-sm">
                        <FiPhone className="text-gray-400" /><span>{phone}</span>
                     </div> : null}
                     {state ? <div className="flex space-x-2 items-center text-gray-600 text-sm capitalize">
                        <FiMapPin className="text-gray-400" /><span>{state}</span>
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
         <div className="p-6">
            content
         </div>
      </div>
   )
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
      props: {
         // query: context.query
      }
   }
}