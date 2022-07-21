import { useState } from "react"
import { formatDate, formatNumber } from "@utils/index"
import { getPastDate } from "@utils/chart.utils"
import TransactionsChart, { DataSet } from "@components/TransactionsChart"
import { useRouter } from "next/router"
import { useFetch } from "@utils/fetch"
import { queryKeys } from "@configs/reactQueryConfigs"

const TransactionsTable = () => null

export default function Overview() {
   const router = useRouter()
   const [period, setPeriod] = useState(getPastDate())

   const { data, isFetching } = useFetch({
      key: [queryKeys.investments, 'overview'],
      url: `/customers/aggregate`,
      placeholderData: {}
   })

   const { startDate, investment, liquidation, interest, balance, total } = {} as _Object
   const [investmentData, liquidationData] = [[], []]

   const dataSet: DataSet[] = [
      { label: "liquidation", color: "text-red-600", data: liquidationData },
      { label: "investment", color: "text-indigo-600", data: investmentData },
   ]

   return (
      <div className="space-y-8">
         <div className="grid grid-cols-4 gap-2 lg:gap-4">
            <OverviewCard
               // title={"balance"}
               title={router.query.id as string}
               amount={balance}
               subTitle="Updated today"
               selected
            />
            <OverviewCard
               title={"savings"}
               amount={investment}
               subTitle={startDate && `Started ${formatDate(startDate, true)}`}
            />
            <OverviewCard
               title={"interest earned"}
               amount={interest}
               subTitle="-10% WHT"
            />
            <OverviewCard
               title={"total liquidation"}
               amount={liquidation}
               color={liquidation > 0 ? "red" : ""}
            />
         </div>

         <TransactionsChart
            title="Overview"
            dataSet={dataSet}
            setPeriod={setPeriod}
            period={period}
            labels={false}
            height={250}
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
}
function OverviewCard({ color = "gray", ...props }: CardProps) {
   const displayAmount = props.amount ? formatNumber(props.amount, "N") : "0.00"

   return (
      <div className={`p-4 cursor-pointer space-y-1 flex flex-col rounded-lg shadow-lg 
                ${props.selected ? `bg-indigo-600 text-white` : `bg-white text-gray-500`}
            `}
      >
         <p className={`uppercase text-xs tracking-wider ${props.selected && "text-blue-200"}`}>{props.title}</p>
         {
            typeof props.amount === 'undefined' ?
               <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-gray-300 w-28 rounded"></div>
                  <div className="h-2 bg-gray-200 w-20 rounded"></div>
               </div> :
               <>
                  <h3 className={`text-2xl lg:text-3xl uppercase font-medium ${props.selected ? "text-white" : `text-${color}-600`}`}>{displayAmount}</h3>
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