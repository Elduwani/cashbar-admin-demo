import Button from '@components/Button';
import FetchError from '@components/FetchError';
import FullPageCenterItems from '@components/FullPageCenterItems';
import PageTitle from '@components/PageTitle';
import ReactTable from '@components/ReactTable';
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { tableRowStatus } from '@hooks/index';
import { useFetch } from '@utils/fetch';
import { formatDate, formatNumber } from '@utils/index';
import { FiPlus } from 'react-icons/fi';

export default function Expenses() {
   const { openModal } = useModal()
   const { data, isFetching, error, refetch } = useFetch({
      url: `/expenses?`,
      key: [queryKeys.expenses, '*'],
      placeholderData: []
   })

   const expenses = data as Expense[]

   const utilities = [
      <Button
         key={1}
         icon={FiPlus}
         onClick={() => openModal({
            element: '',
            title: '',
            type: 'modal'
         })}
         variant="blue"
         secondary
         shrink
      >Add record</Button>
   ]

   return (
      <div className="p-8 pt-0 space-y-6">
         <PageTitle title="Expenses" />
         {
            isFetching ?
               <FullPageCenterItems>
                  <Spinner />
               </FullPageCenterItems>
               : error ?
                  <FullPageCenterItems>
                     <FetchError refetch={refetch} error={error} />
                  </FullPageCenterItems>
                  : expenses?.length ?
                     <ReactTable
                        key={expenses?.length}
                        columns={columns}
                        data={expenses}
                        exportCSV={"expenses"}
                        utilities={utilities}
                        search={[
                           ['amount', 'paid_at', 'narration', 'category', 'channel', 'addedBy.name'],
                        ]}
                     />
                     :
                     <FullPageCenterItems>There are no expenses yet</FullPageCenterItems>
         }
      </div>
   );
}

const columns: _TableColumn[] = [
   {
      label: "",
      key: "is_validated",
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
      key: "addedBy",
      cell: (cell) => cell.getValue()?.name ?? null
   },
]
