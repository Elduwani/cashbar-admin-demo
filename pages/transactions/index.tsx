import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { useModal } from "@contexts/Modal.context"
import { tableRowStatus } from "@hooks/index"
import TransactionsLayout from "@layouts/transactions/transactions.layout"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { ReactElement } from "react"

export default function Transactions() {
   const { openModal } = useModal()

   const { data, isFetching } = useFetch({
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

Transactions.getLayout = function getLayout(page: ReactElement) {
   return (
      <TransactionsLayout>
         {page}
      </TransactionsLayout>
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