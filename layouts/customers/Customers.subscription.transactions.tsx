import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { tableRowStatus } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"

interface Props {
   data: {
      plan: PaystackPlan
      customerID: string
   }
}
export default function SubscriptionTransactions({ data, ...props }: Props) {
   const { data: trx, isFetching } = useFetch({
      key: [queryKeys.transactions, data.plan.plan_code],
      url: `/customers/subscriptions/transactions?plan_code=${data.plan.plan_code}&customer_id=${data.customerID}`,
      placeholderData: []
   })

   const transactions = (trx as PaystackTransaction[])

   if (isFetching) return (
      <FullPageCenterItems height={600}>
         <Spinner />
      </FullPageCenterItems>
   )

   return (
      <div className="pb-6">
         <h2 className="text-sm">Add aggregate numbers | details</h2>
         <h2 className="text-2xl">Subscription payment history</h2>
         <h2 className="uppercase text-sm tracking-wider opacity-70">{data.plan.name} - {data.plan.interval}</h2>
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