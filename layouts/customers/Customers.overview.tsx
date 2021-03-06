import ReactTable from "@components/ReactTable"
import TransactionsChart, { DataSet } from "@components/TransactionsChart"
import { queryKeys } from "@configs/reactQueryConfigs"
import { tableRowStatus, useTimePeriod } from "@hooks/index"
import { getChartData } from "@utils/chart.utils"
import { useFetch } from "@utils/fetch"
import { formatDate, formatNumber } from "@utils/index"
import { useRouter } from "next/router"
import { useMemo } from "react"

export default function Overview() {
   const { customer_id } = useRouter().query
   const { timePeriod, element: timePeriodPicker } = useTimePeriod()

   const { data, isFetching } = useFetch({
      key: [queryKeys.investments, 'overview', customer_id],
      url: `/customers/aggregates?customer_id=${customer_id}`,
      placeholderData: {} as _Object
   })

   const {
      startDate, transactions, liquidations,
      total_investment, total_interest, balance, total_liquidation
   } = data

   const dataSet: DataSet[] = [
      { label: "investments", color: "text-indigo-600", data: transactions, circle: true },
      { label: "liquidations", color: "text-red-600", data: liquidations },
   ]

   //Memoize this
   const chartData = useMemo(() =>
      dataSet.map(set => getChartData(set.data, timePeriod.value))
      , [timePeriod.value, customer_id])

   return (
      <div className="space-y-8">
         <div className="grid grid-cols-4 gap-2 lg:gap-4">
            <OverviewCard
               title={"balance"}
               amount={balance}
               subTitle="Updated today"
               loading={isFetching}
               selected
            />
            <OverviewCard
               title={"savings"}
               amount={total_investment}
               subTitle={startDate && `Started ${formatDate(startDate, true)}`}
               loading={isFetching}
            />
            <OverviewCard
               title={"interest earned"}
               amount={total_interest}
               subTitle="-10% WHT"
               loading={isFetching}
            />
            <OverviewCard
               title={"total liquidation"}
               amount={total_liquidation}
               color={total_liquidation > 0 ? "red" : ""}
               loading={isFetching}
            />
         </div>

         <TransactionsChart
            title=""
            dataSet={dataSet}
            data={chartData}
            loading={isFetching}
            timePeriodPicker={timePeriodPicker}
            height={250}
         />

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

interface CardProps {
   amount: number
   title: string
   selected?: boolean
   subTitle?: string
   color?: string
   loading?: boolean
}
function OverviewCard({ color = "gray", ...props }: CardProps) {
   const displayAmount = props.amount ? formatNumber(props.amount, "$", false) : "0.00"

   return (
      <div
         className={`p-4 space-y-1 flex flex-col rounded-lg shadow-lg overflow-hidden
            ${props.selected ? `bg-indigo-600 text-white` : `bg-white text-gray-500`}
         `}
      >
         <p className={`uppercase text-xs tracking-wider ${props.selected && "text-blue-200"}`}>{props.title}</p>
         {
            props.loading ?
               <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-gray-300 w-4/5 rounded-full"></div>
                  <div className="h-2 bg-gray-300 w-3/5 rounded-full"></div>
                  <div className="h-2 bg-gray-200 w-2/4 rounded-full"></div>
               </div> :
               <>
                  <h3 className={`text-2xl lg:text-3xl uppercase font-medium ${props.selected ? "text-white" : `text-${color}-600`}`}>
                     {displayAmount}
                  </h3>
                  <p className="text-xs capitalize">{props.subTitle ?? null}</p>
               </>
         }
      </div>
   )
}

const tabelColumns: _TableColumn[] = [
   {
      label: "",
      key: "status",
      modifier: (cell: Transaction) => tableRowStatus(cell.status === 'success'),
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (cell) => formatNumber(cell.getValue(), '', false)
   },
   {
      label: "date",
      key: "paid_at",
      cell: (cell) => formatDate(cell.getValue(), true, true)
   },
   {
      key: "channel",
   },
]