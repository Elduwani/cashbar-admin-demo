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
      <FullPageCenterItems height={500}>
         <Spinner />
      </FullPageCenterItems>
   )

   return (
      <div className="">
         <h2 className="text-2xl">Subscription payment history</h2>
         <h2 className="uppercase text-sm tracking-wider opacity-70">{data.plan.name}</h2>
         {
            transactions?.length ?
               <ReactTable
                  columns={tabelColumns}
                  data={transactions}
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