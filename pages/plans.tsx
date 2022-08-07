import Button from '@components/Button';
import FetchError from '@components/FetchError';
import FullPageCenterItems from '@components/FullPageCenterItems';
import PageTitle from '@components/PageTitle';
import ReactTable from '@components/ReactTable';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { tableRowStatus } from '@hooks/index';
import AddExpense from '@modals/AddExpense.modal';
import { useFetch } from '@utils/fetch';
import { formatDate, formatNumber } from '@utils/index';
import { FiPlus } from 'react-icons/fi';

export default function Plans() {
   const { openModal } = useModal()

   const { data, isFetching, error, refetch } = useFetch({
      url: `/plans`,
      key: [queryKeys.plans, '*'],
      placeholderData: []
   })

   const plans = data as PaystackPlan[]

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
      >New Plan</Button>
   ]

   return (
      <div className="p-8 pt-0 space-y-6">
         <PageTitle title="Expenses" utilities={utilities} />
         <div className="w-full">
            {
               error ?
                  <FullPageCenterItems height={500}>
                     <FetchError refetch={refetch} error={error} />
                  </FullPageCenterItems>
                  : plans?.length ?
                     <ReactTable
                        key={plans?.length}
                        columns={columns}
                        data={plans}
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
   );
}

const columns: _TableColumn<Plan>[] = [
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
      key: "created_by",
      cell: (cell) => cell.getValue()?.email,
      capitalize: false
   },
]
