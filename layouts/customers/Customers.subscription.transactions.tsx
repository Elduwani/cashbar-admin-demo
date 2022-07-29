import FullPageCenterItems from "@components/FullPageCenterItems"
import { ActionMenu } from "@components/PopOver"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { subscriptionStatusIndicator, tableRowStatus, useSubscriptiontMenu } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"

interface Props {
   data: {
      plan: PaystackPlan
      customerID: string
      subscription: PaystackSubscription
   }
}
export default function SubscriptionHistory({ data }: Props) {
   const menu = useSubscriptiontMenu(data.subscription)

   const { data: _data, isFetching } = useFetch({
      key: [queryKeys.transactions, data.plan.plan_code],
      url: `/customers/subscriptions/history?plan_code=${data.plan.plan_code}&customer_id=${data.customerID}`,
      placeholderData: {}
   })

   const { transactions, transaction_volume } = _data as _SubscriptionHistory ?? {}

   if (isFetching) return (
      <FullPageCenterItems height={600}>
         <Spinner />
      </FullPageCenterItems>
   )

   return (
      <div className="pb-6 space-y-4">
         <div className="flex">
            <div className="w-full">
               <h2 className="text-2xl">Subscription payment history</h2>
               <h2 className="capitalize ">{formatNumber(data.plan.amount, "$")} {data.plan.interval}, {data.subscription.status}</h2>
               <h2 className="capitalize text-sm opacity-70">{data.plan.name}</h2>
               {
                  transactions?.length ?
                     <h2 className="text-sm opacity-70">
                        {transactions.length} payments ({formatNumber(transaction_volume, "$")})
                     </h2> : null
               }
            </div>
            <div className="flex space-x-2">
               {subscriptionStatusIndicator(data.subscription.status)}
               <ActionMenu menu={menu} className="border" />
            </div>
         </div>
         {
            transactions?.length ?
               <ReactTable
                  columns={tabelColumns}
                  data={transactions}
               />
               :
               <FullPageCenterItems className="text-slate-500" height={600}>
                  There are no payments for this subscription
               </FullPageCenterItems>
         }
      </div>
   )
}

const tabelColumns: _TableColumn[] = [
   {
      label: "",
      key: "status",
      cell: (cell) => tableRowStatus(cell.getValue() === 'success'),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (cell) => formatNumber(cell.getValue(), '', false)
   },
   {
      label: "date",
      key: "paid_at",
      cell: (cell) => formatDate(cell.getValue(), true, true),
   }
]