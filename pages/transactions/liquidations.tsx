import FullPageCenterItems from "@components/FullPageCenterItems"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { useModal } from "@contexts/Modal.context"
import useFilters from "@hooks/filters"
import { tableRowStatus } from "@hooks/index"
import TransactionsLayout from "@layouts/transactions/Transactions.layout"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { ReactElement, useState } from "react"

export default function Liquidations() {
   const { openModal } = useModal()
   const [queryString, setQueryString] = useState<string>()
   const { element: filters } = useFilters(setQueryString)

   const { data, isFetching } = useFetch({
      enabled: !!queryString?.length,
      key: [queryKeys.liquidations, queryString, 'filtered'],
      url: `/liquidations?${queryString}`,
      placeholderData: {}
   })

   const liquidations = data as DBLiquidation[]

   return (
      <div className="h-full flex space-x-4">
         <div className="w-full max-w-md">
            {filters}
         </div>
         <div className="w-full">
            {
               isFetching ? (
                  <FullPageCenterItems height={500}>
                     <Spinner />
                  </FullPageCenterItems>
               ) :
                  liquidations?.length ?
                     <ReactTable
                        columns={tabelColumns}
                        data={liquidations}
                        utilities
                     />
                     :
                     <FullPageCenterItems height={500}>
                        <p className="text-gray-500">Search results will display here</p>
                     </FullPageCenterItems>
            }
         </div>
      </div>
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
   },
   {
      key: "reference",
      cell: (cell) => (cell.getValue() as string)?.substring(0, 20),
      capitalize: false
   }
]