import Button from '@components/Button';
import FetchError from '@components/FetchError';
import FullPageCenterItems from '@components/FullPageCenterItems';
import PageTitle from '@components/PageTitle';
import ReactTable from '@components/ReactTable';
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import useFilters from '@hooks/filters';
import { tableRowStatus } from '@hooks/index';
import AddExpense from '@modals/AddExpense.modal';
import { useFetch } from '@utils/fetch';
import { formatDate, formatNumber } from '@utils/index';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

export default function Expenses() {
   const { openModal } = useModal()
   const [queryString, setQueryString] = useState<string>()
   const { element: filters } = useFilters(setQueryString)

   const { data, isFetching, error, refetch } = useFetch({
      url: `/expenses?${queryString}`,
      enabled: !!queryString?.length,
      key: [queryKeys.expenses, '*', queryString],
      placeholderData: []
   })

   const expenses = data as Expense[]

   const utilities = [
      <Button
         key={1}
         icon={FiPlus}
         variant="teal"
         onClick={() => openModal({
            element: <AddExpense />,
            title: '',
            type: 'modal'
         })}
      >Add Expense</Button>
   ]

   return (
      <div className="p-8 pt-0 space-y-6">
         <PageTitle title="Expenses" utilities={utilities} />
         <div className="h-full flex space-x-8 pt-6">
            <div className="w-full max-w-md">
               {filters}
            </div>
            <div className="w-full">
               {
                  error ?
                     <FullPageCenterItems height={500}>
                        <FetchError refetch={refetch} error={error} />
                     </FullPageCenterItems>
                     : expenses?.length ?
                        <ReactTable
                           key={expenses?.length}
                           columns={columns}
                           data={expenses}
                           exportCSV={"expenses"}
                           className={isFetching ? 'pointer-events-none opacity-50' : ''}
                           utilities
                           search={[
                              ['amount', 'paid_at', 'narration', 'category', 'channel', 'created_by.email'],
                           ]}
                        />
                        :
                        <FullPageCenterItems height={500} className="text-gray-500">
                           Search results will display here
                        </FullPageCenterItems>
               }
            </div>
         </div>

      </div>
   );
}

const columns: _TableColumn<Expense>[] = [
   {
      label: "",
      key: "validated",
      cell: (cell) => tableRowStatus(cell.getValue()),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (n) => formatNumber(n.getValue())
   },
   {
      key: "paid_at",
      label: "date",
      cell: (d) => formatDate(d.getValue())
   },
   { key: 'narration' },
   {
      key: "category",
      cellStyle: () => 'bg-green-50'
   },
   { key: "channel" },
   {
      label: "added by",
      key: "created_by",
      cell: (cell) => cell.getValue()?.email,
      capitalize: false
   },
]
