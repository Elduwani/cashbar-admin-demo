import { queryKeys } from "@configs/reactQueryConfigs"
import { metricPrefix } from "@utils/index"
import { useFetch } from "@utils/fetch"
import { IconType } from "react-icons"
import { FiArrowUp } from "react-icons/fi"
import { HiOutlineCurrencyDollar, HiOutlineChartPie, HiOutlineShoppingBag, HiOutlineUserCircle, HiCreditCard } from "react-icons/hi"
import FullPageCenterItems from "@components/FullPageCenterItems"
import Spinner from "@components/Spinner"

export default function HomeAggregate() {
   const { data, isFetching } = useFetch({
      key: [queryKeys.aggregates, 'all'],
      url: `/aggregates`,
      placeholderData: {} as AllAggregates
   })

   return (
      <div className="flex flex-col h-full">
         <h2 className="text-2xl font-bold text-slate-600">Hello, Stranger</h2>
         <p className="opacity-70 text-slate-600">Here are the stats for today</p>
         {
            isFetching ?
               <FullPageCenterItems height={400}>
                  <Spinner />
               </FullPageCenterItems>
               :
               <div className="space-y-6 my-12 text-slate-700">
                  <Detail
                     title="Revenue"
                     amount={data.investmentVolume}
                     trend="15%"
                     currency="$"
                     icon={HiOutlineCurrencyDollar}
                  />
                  <Detail
                     title="Liquidations"
                     amount={data.liquidationVolume}
                     trend="-2.61%"
                     currency="$"
                     icon={HiOutlineChartPie}
                  />
                  <Detail
                     title="Expenses"
                     amount={data.expenseVolume}
                     trend="0.04%"
                     icon={HiOutlineShoppingBag}
                  />
                  <Detail
                     title="Customers"
                     amount={data.customerCount}
                     trend="10.45%"
                     icon={HiOutlineUserCircle}
                  />
                  <Detail
                     title="Transactions"
                     amount={data.transactionCount}
                     trend="10.45%"
                     icon={HiCreditCard}
                  />
               </div>
         }
         <div className="rounded-xl bg-gradient-to-tr from-pink-700 to-indigo-500 grid place-content-center text-white text-center p-6 px-8 shadow-2xl space-y-2 mt-auto">
            <p className="text-3xl font-bold">MoneyBall '23</p>
            <p className="text-sm opacity-85">
               Contented consisted continual curiosity contained get. Forth dried in aware do promotion.
            </p>
         </div>
      </div>
   )
}


interface DetailProps {
   title: string
   trend: string
   amount: number
   currency?: string
   icon: IconType
}
function Detail(props: DetailProps) {
   const modifiedAmount = props.amount && `${props.currency ? props.currency : ""}${metricPrefix(props.amount)}`

   return (
      <div className="flex space-x-6">
         <props.icon className="text-2xl flex-shrink-0 mt-1.5 text-slate-500" />
         <div className="space-y-1">
            <p className="uppercase tracking-wider text-xs">{props.title}</p>
            <h2 className="text-2xl lg:text-3xl font-medium">{modifiedAmount || "0"}</h2>
            <p className="flex items-center whitespace-nowrap text-sm space-x-1"><FiArrowUp /><span>{props.trend}</span></p>
         </div>
      </div>
   )
}
