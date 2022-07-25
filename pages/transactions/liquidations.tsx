import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { useModal } from "@contexts/Modal.context"
import TransactionsLayout from "@layouts/transactions/transactions.layout"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { ReactElement } from "react"
import { FiCheck, FiX } from "react-icons/fi"

export default function Liquidations() {
   const { openModal } = useModal()

   const { data, isFetching } = useFetch({
      enabled: false,
      key: [queryKeys.transactions, 'all'],
      url: `/transactions`,
      placeholderData: {}
   })

   const { transactions } = data as { transactions: PaystackTransaction[] } ?? {}

   if (isFetching) return (
      <FullPageCenterItems height={500}>
         <Spinner />
      </FullPageCenterItems>
   )

   return (
      <>
         Liquidations
         {
            transactions?.length ?
               <ReactTable
                  columns={tabelColumns}
                  data={transactions}
               />
               : null
         }
      </>
   )
}

Liquidations.getLayout = function getLayout(page: ReactElement) {
   return (
      <TransactionsLayout>
         {page}
      </TransactionsLayout>
   )
}

const tabelColumns: _TableColumn[] = [
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