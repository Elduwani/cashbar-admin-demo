import { useState } from "react"
import { formatDate, formatNumber } from "@utils/index"
import { getPastDate } from "@utils/chart.utils"
import TransactionsChart, { DataSet } from "@components/TransactionsChart"
import { useRouter } from "next/router"
import { useFetch } from "@utils/fetch"
import { queryKeys } from "@configs/reactQueryConfigs"
import FullPageCenterItems from "@components/FullPageCenterItems"
import Spinner from "@components/Spinner"

const TransactionsTable = () => null

export default function Overview() {
   const { id } = useRouter().query
   const [period, setPeriod] = useState(getPastDate())

   const { data, isFetching } = useFetch({
      key: [queryKeys.investments, 'overview', id],
      url: `/customers/aggregate?id=${id}`,
      placeholderData: {}
   })

   const {
      startDate, transactions, liquidations,
      total_investment, total_interest, balance, total_liquidation
   } = data

   const dataSet: DataSet[] = [
      { label: "liquidation", color: "text-red-600", data: liquidations },
      { label: "investment", color: "text-indigo-600", data: transactions },
   ]

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
            title="Overview"
            dataSet={dataSet}
            setPeriod={setPeriod}
            period={period}
            // labels={false}
            height={250}
            loading={isFetching}
         />

         <TransactionsTable
         // tableHead={tableHead}
         // transactions={data}
         // total={total}
         // hideControls
         />
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
   const displayAmount = props.amount ? formatNumber(props.amount, "N", false) : "0.00"

   return (
      <div
         className={`p-4 cursor-pointer space-y-1 flex flex-col rounded-lg shadow-lg overflow-hidden
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
      modifier: (_, index) => index + 1,
      headerStyle: { maxWidth: 20 }
   },
   {
      key: "amount",
      cell: (cell) => formatNumber(cell.getValue())
   },
   {
      label: "date",
      key: "paid_at",
      cell: (cell) => formatDate(cell.getValue(), true)
   },
   { key: "reference" },
   {
      key: "channel",
      // cell: (cell) => `${cell.row.original.customer?.surname} ${cell.row.original.customer?.forenames}`
   },
]