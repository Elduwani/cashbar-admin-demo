import FullPageCenterItems from "@components/FullPageCenterItems"
import PageTitle from "@components/PageTitle"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { tableRowStatus } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { FiCheck, FiX } from "react-icons/fi"

interface Props {
   plan: PaystackPlan
}
export default function PlanDetails(props: Props) {
   const { data: _data, isFetching } = useFetch({
      key: [queryKeys.plans, props.plan.id],
      url: `/plans`,
      placeholderData: {}
   })

   const plan = _data as Plan ?? {}

   return (
      <div className="pb-6 space-y-8">
         <PageTitle
            title={props.plan.name}
            subtitle={`${formatNumber(props.plan.amount, "$")} ${props.plan.interval}`}
            utilities={'Menu'}
         />
         <div className="flex flex-col items-center space-y-2 p-6 border shadow-sm bg-white rounded-xl">
            <p className="opacity-70 text-sm">Created {formatDate(props.plan.createdAt, true, true)}</p>
            <h3 className="text-2xl">
               Total Savings: {formatNumber(3444938, "$")}
            </h3>
            <div className="flex space-x-5 text-gray-600 capitalize">
               <p className="flex items-center space-x-2">
                  {tableRowStatus(true)}
                  <span>active: {12}</span>
               </p>
               <p className="flex items-center space-x-2">
                  {tableRowStatus(true, 'bg-red-600')}
                  <span>total: {32}</span>
               </p>
            </div>
         </div>
         {
            isFetching ?
               <FullPageCenterItems height={600}>
                  <Spinner />
               </FullPageCenterItems>
               :
               [].length ?
                  <div className="">
                     <p>Subscriptions</p>
                     <ReactTable
                        columns={tabelColumns}
                        data={[]}
                     // rowStyles={rowStyles}
                     />
                  </div>
                  :
                  <FullPageCenterItems className="text-slate-500" height={300}>
                     There are no payments for this subscription
                  </FullPageCenterItems>
         }
      </div>
   )
}

const tabelColumns: _TableColumn<Subscription>[] = [
   {
      label: "",
      key: "id",
      modifier: (cell: Subscription) => tableRowStatus(cell.status === 'active'),
      headerStyle: { maxWidth: 20 }
   },
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
               <p>{sub.plan?.name}</p>
               <p className="opacity-60">{sub.plan?.interval}</p>
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