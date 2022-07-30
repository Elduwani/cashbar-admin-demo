import FullPageCenterItems from "@components/FullPageCenterItems"
import { ActionMenu } from "@components/PopOver"
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
      key: [queryKeys.transactions, props.plan.id, props.customer_id],
      url: `/customers/subscriptions/history?plan=${props.plan.id}&customer=${props.customer_id}`,
      placeholderData: {}
   })

   const {
      balance,
      transaction_volume,
      liquidation_volume,
      transactions,
      liquidations,
      merged_data
   } = _data as SubscriptionAnalysis ?? {}

   const menu = useSubscriptionMenu(props.subscription, balance)
   const rowStyles = (trx: typeof merged_data[number]) => {
      return `${trx.is_liquidation && 'text-red-600'}`
   }

   return (
      <div className="pb-6 space-y-4">
         <div className="flex">
            <div className="w-full">
               <h2 className="text-2xl">{props.plan.name}</h2>
               <div className="opacity-70 capitalize">
                  {
                     transaction_volume ?
                        <h3 className="text-xl">
                           {formatNumber(balance, "$")}
                        </h3> : null
                  }
                  <h2 className="">
                     {formatNumber(props.plan.amount, "$")} {props.plan.interval}
                  </h2>
                  {
                     transaction_volume ?
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
         {/* {props.subscription.id} */}
         {/* <pre>{JSON.stringify(props.subscription, null, 2)}</pre> */}
         {
            isFetching ?
               <FullPageCenterItems height={600}>
                  <Spinner />
               </FullPageCenterItems>
               :
               merged_data?.length ?
                  <ReactTable
                     columns={tabelColumns}
                     data={merged_data}
                     rowStyles={rowStyles}
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
      cell: (cell) => {
         const data = cell.row.original as Transaction
         if (data.is_liquidation) return (
            <span className="rounded-full bg-red-50 text-red-800 w-6 h-6 grid place-content-center">
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