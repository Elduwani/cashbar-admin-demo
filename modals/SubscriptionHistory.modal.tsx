import FullPageCenterItems from "@components/FullPageCenterItems"
import { ActionMenu } from "@components/PopOver"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { subscriptionStatusIndicator, tableRowStatus, useSubscriptionMenu } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"

interface Props {
   plan: PaystackPlan
   customer_id: string
   subscription: Subscription
}
export default function SubscriptionHistory(props: Props) {
   const { data: _data, isFetching } = useFetch({
      key: [queryKeys.transactions, props.plan.id, props.customer_id],
      url: `/customers/subscriptions/history?plan=${props.plan.id}&customer=${props.customer_id}`,
      placeholderData: {}
   })

   const { transaction_volume, balance, liquidation_volume, transactions, liquidations } = _data as SubscriptionAnalysis ?? {}
   const menu = useSubscriptionMenu(props.subscription, transaction_volume)

   return (
      <div className="pb-6 space-y-4">
         <div className="flex">
            <div className="w-full">
               <h2 className="text-2xl">{props.plan.name}</h2>
               <div className="opacity-70 capitalize">
                  <h3 className="text-xl">
                     {formatNumber(balance, "$")}
                  </h3>
                  <h2 className="">
                     {formatNumber(props.plan.amount, "$")} {props.plan.interval}
                  </h2>
                  {
                     transactions?.length ?
                        <h2 className="text-sm">
                           {transactions.length} payments, {liquidations.length} liquidations
                        </h2> : null
                  }
               </div>
            </div>
            <div className="flex space-x-2">
               {subscriptionStatusIndicator(props.subscription.status)}
               <ActionMenu menu={menu} className="border" />
            </div>
         </div>
         {/* <pre>{JSON.stringify(props.subscription, null, 2)}</pre> */}
         {
            isFetching ?
               <FullPageCenterItems height={600}>
                  <Spinner />
               </FullPageCenterItems>
               :
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