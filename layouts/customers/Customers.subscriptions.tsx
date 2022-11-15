import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { useModal } from "@contexts/Modal.context"
import { tableRowStatus } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { useRouter } from "next/router"
import { FiCheck, FiPlus, FiX } from "react-icons/fi"
import SubscriptionHistory from "@modals/SubscriptionHistory.modal"
import Button from "@components/Button"
import AddSubscription from "@modals/AddSubscription.modal "

export default function Subscriptions() {
   const router = useRouter()
   const customerID = router.query.customer_id
   const { openModal } = useModal()

   const { data, isFetching } = useFetch({
      key: [queryKeys.subscriptions, customerID],
      url: `/customers/subscriptions?customer=${customerID}`,
      placeholderData: []
   })

   const subscriptions = (data as Subscription[])
   // console.log(subscriptions[0].plan)

   const onClick = (sub: Subscription) => openModal({
      type: "drawer",
      element:
         <SubscriptionHistory
            plan={sub.plan}
            subscription={sub}
            customer_id={customerID as string}
         />,
   })
   const rowStyles = (subscription: Subscription) => `
      py-4 ${subscription.status === 'active' && `bg-teal-50`}
      ${subscription.status === 'cancelled' && `bg-slate-50/50 text-slate-500`}
   `

   if (isFetching) return (
      <FullPageCenterItems height={500}>
         <Spinner />
      </FullPageCenterItems>
   )

   const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')

   return (
      <div className="">

         {
            subscriptions?.length ?
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex space-x-2 capitalize">
                        <p className="">{subscriptions.length} subscriptions,</p>
                        <p className="text-slate-500">{activeSubscriptions.length} active</p>
                     </div>
                     <Button
                        icon={FiPlus}
                        variant="teal"
                        shrink
                        onClick={() => openModal({
                           element: <AddSubscription customerID={customerID as string} />,
                           title: '',
                           type: 'modal'
                        })}
                     >add</Button>
                  </div>
                  <ReactTable
                     columns={tabelColumns}
                     data={subscriptions}
                     rowStyles={rowStyles}
                     onClick={onClick}
                  />
               </div>
               :
               <FullPageCenterItems>
                  There are no subscriptions yet for this customer
               </FullPageCenterItems>
         }
      </div>
   )
}

const tabelColumns: _TableColumn<Subscription>[] = [
   {
      label: "",
      key: "id",
      modifier: (cell: Subscription) => tableRowStatus(cell.status === 'active'),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (cell) => formatNumber(cell.getValue(), '', false)
   },
   {
      key: "plan",
      cell: (cell) => {
         const sub = cell.row.original as Subscription
         return (
            <>
               <p>{sub.plan.name}</p>
               <p className="opacity-60">{sub.plan.interval}</p>
            </>
         )
      }
   },
   {
      label: "next payment",
      key: "next_payment_date",
      cell: (cell) => {
         const sub = cell.row.original as Subscription
         const elements: Record<typeof sub.status, any> = {
            'active': formatDate(cell.getValue(), true, true),
            'complete': <FiCheck className="text-slate-400 text-lg" />,
            'cancelled': <FiX className="text-slate-400 text-lg" />,
         }
         // return sub.plan.plan_code
         return elements[sub.status]
      }
   },
   {
      key: "status",
      cell: (cell) => {
         const sub = cell.row.original as Subscription
         return sub.status
      }
   },
]