import FullPageCenterItems from "@components/FullPageCenterItems"
import { ActionMenu } from "@components/PopOver"
import { CircularProgress } from "@components/ProgressBar"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { subscriptionStatusIndicator, tableRowStatus, useSubscriptionMenu } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { FiArrowDownLeft } from "react-icons/fi"

interface Props {
   plan: PaystackPlan
   customer_id: string
   subscription: Subscription
}
export default function SubscriptionHistory(props: Props) {
   const { data: _data, isFetching } = useFetch({
      key: [queryKeys.history, props.subscription.id, props.customer_id],
      url: `/customers/subscriptions/history?plan=${props.plan.id}&customer=${props.customer_id}`,
      placeholderData: {}
   })

   const analysis = _data as SubscriptionAnalysis ?? {}

   const menu = useSubscriptionMenu(props.subscription, analysis.balance)
   const rowStyles = (trx: typeof analysis.merged_data[number]) => {
      return `${trx.is_liquidation && 'text-red-600'}`
   }

   return (
      <div className="pb-6 space-y-8">
         <div className="flex">
            <div className="w-full">
               <h2 className="text-2xl">{props.plan.name}</h2>
               <div className="opacity-70 capitalize">
                  <h2 className="">
                     {formatNumber(props.plan.amount, "$")} {props.plan.interval}
                  </h2>
                  {
                     analysis.transaction_volume ?
                        <h2 className="text-sm">
                           {analysis.transaction_count} payments, {analysis.liquidation_count} liquidations
                        </h2> : null
                  }
               </div>
            </div>
            <div className="flex space-x-2">
               {subscriptionStatusIndicator(props.subscription.status)}
               <ActionMenu menu={menu} className="border" />
            </div>
         </div>
         <div className="flex flex-col items-center space-y-2">
            <CircularProgress
               radius={80}
               progress={analysis.percentage_liquidated}
               subtitle="liquidated"
            // accentColor={isOverdraft ? 'rgb(239 68 68)' : undefined}
            />
            <h3 className="text-2xl">
               Total Savings: {formatNumber(analysis.transaction_volume, "$")}
            </h3>
            <div className="flex space-x-5 text-gray-600">
               <p className="flex items-center space-x-2">
                  {tableRowStatus(true)}
                  <span>Balance: {formatNumber(analysis.balance, "$")}</span>
               </p>
               <p className="flex items-center space-x-2">
                  {tableRowStatus(true, 'bg-red-600')}
                  <span>Liquidated: {formatNumber(analysis.liquidation_volume, "$")}</span>
               </p>
            </div>
         </div>
         {
            isFetching ?
               <FullPageCenterItems height={600}>
                  <Spinner />
               </FullPageCenterItems>
               :
               analysis.merged_data?.length ?
                  <div className="">
                     <p>Transaction history</p>
                     <ReactTable
                        columns={tabelColumns}
                        data={analysis.merged_data}
                        rowStyles={rowStyles}
                     />
                  </div>
                  :
                  <FullPageCenterItems className="text-slate-500" height={300}>
                     There are no payments for this subscription
                  </FullPageCenterItems>
         }
      </div>
   )
}

const tabelColumns: _TableColumn<Transaction>[] = [
   {
      label: "",
      key: "status",
      cell: (cell) => {
         const data = cell.row.original as Transaction
         if (data.is_liquidation) return (
            <span className="rounded-full bg-red-50 text-red-600 w-6 h-6 grid place-content-center">
               <FiArrowDownLeft />
            </span>
         )
         return tableRowStatus(cell.getValue() === 'success')
      },
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (cell) => {
         const data = cell.row.original as Transaction
         const value = formatNumber(cell.getValue(), '', false)
         return data.is_liquidation ? `-${value}` : value
      }
   },
   {
      label: "date",
      key: "paid_at",
      cell: (cell) => formatDate(cell.getValue(), true, true),
   }
]