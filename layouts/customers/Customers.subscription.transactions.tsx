import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { tableRowStatus } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { FiCheck, FiX } from "react-icons/fi"

interface Props {
   planCode: string
   customerID: string
}
export default function SubscriptionTransactions(props: Props) {
   const { data, isFetching } = useFetch({
      key: [queryKeys.subscriptions, queryKeys.transactions, props.planCode],
      url: `/customers/subscriptions/transactions?plan_code=${props.planCode}&customer_id=${props.customerID}`,
      placeholderData: []
   })

   const subscriptions = (data as Subscription[])
   // const onClick = (customer: Subscription) => router.push(`/customers/${String(customer.id)}`)
   const rowStyles = (subscription: Subscription) => `
      py-6 ${subscription.status === 'active' && `bg-teal-50`}
      ${subscription.status === 'cancelled' && `bg-slate-50/50 text-slate-500`}
   `

   if (isFetching) return (
      <FullPageCenterItems height={500}>
         <Spinner />
      </FullPageCenterItems>
   )

   return (
      <div className="">
         {
            subscriptions?.length ?
               <ReactTable
                  columns={tabelColumns}
                  data={subscriptions}
                  rowStyles={rowStyles}
               />
               : null
         }
      </div>
   )
}

const tabelColumns: _TableColumn[] = [
   {
      label: "",
      key: "status",
      cell: (cell) => tableRowStatus(cell.getValue() === 'active'),
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
         return sub.plan.name ?? ''
      }
   },
   {
      label: "next payment",
      key: "next_payment_date",
      cell: (cell) => {
         const sub = cell.row.original as PaystackSubscription
         const elements: Record<typeof sub.status, any> = {
            'active': formatDate(cell.getValue(), true, true),
            'complete': <FiCheck className="text-slate-400 text-lg" />,
            'cancelled': <FiX className="text-slate-400 text-lg" />,
         }
         return elements[sub.status]
      }
   },
   {
      key: "status",
   },
]