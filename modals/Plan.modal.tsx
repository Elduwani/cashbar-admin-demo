import FullPageCenterItems from "@components/FullPageCenterItems"
import PageTitle from "@components/PageTitle"
import ReactTable from "@components/ReactTable"
import Spinner from "@components/Spinner"
import { queryKeys } from "@configs/reactQueryConfigs"
import { tableRowStatus } from "@hooks/index"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber, cx } from "@utils/index"
import { FiArrowDownLeft } from "react-icons/fi"

interface Props {
   plan: PaystackPlan
}
export default function PlanDetails(props: Props) {
   const { data, isFetching } = useFetch({
      key: [queryKeys.plans, props.plan.id],
      url: `/plans?id=${props.plan.id}`,
      placeholderData: {}
   })

   const details = data as PlanDetails ?? {}

   return (
      <div className="pb-6 space-y-8">
         <PageTitle
            title={props.plan.name}
            subtitle={`${formatNumber(props.plan.amount, "$")} ${props.plan.interval}`}
         />
         <div className={cx(
            "flex flex-col items-center space-y-2 p-6 border",
            "shadow-sm bg-indigo-600 text-white rounded-xl"
         )}>
            <p className="opacity-70 text-sm">Created {formatDate(props.plan.createdAt, true, true)}</p>
            <h3 className="text-2xl">
               Total Saved: {formatNumber(props.plan.total_subscriptions_revenue, "$")}
            </h3>
            <p className="flex items-center space-x-2">
               Liquidations: {formatNumber(details.total_liquidation, "$")}
            </p>
         </div>
         {
            isFetching ?
               <FullPageCenterItems height={600}>
                  <Spinner />
               </FullPageCenterItems>
               :
               (
                  <>
                     {
                        details.subscriptions?.length ?
                           <div className="space-y-3">
                              <p>Customer subscriptions</p>
                              <ReactTable
                                 columns={subscriptionColumns}
                                 data={details.subscriptions}
                              // rowStyles={rowStyles}
                              />
                           </div>
                           : null
                     }
                     {
                        details.liquidations?.length ?
                           <div className="space-y-3">
                              <p>Liquidations</p>
                              <ReactTable
                                 columns={liquidationColumns}
                                 data={details.liquidations}
                              />
                           </div>
                           : null
                     }
                  </>
               )
         }
         {
            !props.plan.total_subscriptions && (
               <FullPageCenterItems className="text-slate-500" height={300}>
                  There are no subscriptions for this plan yet
               </FullPageCenterItems>
            )
         }
      </div>
   )
}

const subscriptionColumns: _TableColumn<Subscription>[] = [
   {
      label: "",
      key: "id",
      modifier: (cell: Subscription) => tableRowStatus(cell.status === 'active'),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "customer",
      cell: (cell) => {
         const data = cell.row.original as Subscription
         return `${data.customer.first_name} ${data.customer.last_name}`
      }
   },
   // {
   //    key: "amount",
   //    cell: (cell) => formatNumber(cell.getValue(), '', false)
   // },
   {
      label: "subscribed on",
      key: "createdAt",
      cell: (cell) => formatDate(cell.getValue())
   },
   {
      key: "status",
      cell: (cell) => {
         return 'Actions'
      }
   },
]

const liquidationColumns: _TableColumn<Liquidation>[] = [
   {
      label: "",
      key: "is_validated",
      cell: () => (
         <span className="rounded-full bg-red-50 text-red-600 w-6 h-6 grid place-content-center">
            <FiArrowDownLeft />
         </span>
      ),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "customer",
      cell: (cell) => {
         const data = cell.row.original as Liquidation
         return `${data.customer.first_name} ${data.customer.last_name}`
      }
   },
   {
      key: "amount",
      cell: (cell) => formatNumber(cell.getValue(), '', false)
   },
   {
      label: "date",
      key: "paid_at",
      cell: (cell) => formatDate(cell.getValue())
   }
]