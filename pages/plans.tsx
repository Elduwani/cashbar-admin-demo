import Button from '@components/Button';
import FetchError from '@components/FetchError';
import FullPageCenterItems from '@components/FullPageCenterItems';
import PageTitle from '@components/PageTitle';
import ReactTable from '@components/ReactTable';
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { tableRowStatus } from '@hooks/index';
import AddExpense from '@modals/AddExpense.modal';
import PlanDetails from '@modals/Plan.modal';
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

   const onClick = (plan: Plan) => openModal({
      type: 'drawer',
      element: <PlanDetails plan={plan} />,
   })

   return (
      <div className="p-8 pt-0 space-y-6">
         <PageTitle title="Plans" utilities={utilities} />
         <div className="w-full">
            {
               error ?
                  <FullPageCenterItems height={500}>
                     <FetchError refetch={refetch} error={error} />
                  </FullPageCenterItems>
                  : isFetching ?
                     <FullPageCenterItems height={500}>
                        <Spinner />
                     </FullPageCenterItems>
                     : plans?.length ?
                        <ReactTable
                           key={plans?.length}
                           columns={columns}
                           data={plans}
                           exportCSV={"expenses"}
                           onClick={onClick}
                           // className={isFetching ? 'pointer-events-none opacity-50' : ''}
                           utilities
                           search={[
                              ['amount', 'name', 'narration', 'interval', 'createdAt'],
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
      key: "active_subscriptions",
      cell: (cell) => tableRowStatus(cell.getValue()),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "name",
   },
   {
      key: "amount",
      cell: (n) => formatNumber(n.getValue())
   },
   {
      key: 'subscriptions',
      cell: (cell) => {
         const data = cell.row.original as PaystackPlan
         return `${data.total_subscriptions} / ${data.active_subscriptions} active`
      }
   },
   { key: "interval" },
   {
      key: "createdAt",
      label: "created on",
      cell: (d) => formatDate(d.getValue(), true, true)
   },
]
