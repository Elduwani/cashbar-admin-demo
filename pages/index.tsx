import Activities from "@components/Activities";
import Button from "@components/Button";
import TransactionsChart, { DataSet } from "@components/TransactionsChart";
import { getAggregate } from "@controllers/aggregates.server";
import { getPastDate } from "@utils/chart.utils";
import { useFetch } from "@utils/fetch";
import { metricPrefix } from "@utils/index";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiArrowUp } from "react-icons/fi";
import { HiCreditCard, HiOutlineChartPie, HiOutlineCurrencyDollar, HiOutlineShoppingBag, HiOutlineUserCircle } from "react-icons/hi";

type AggregateData = Awaited<ReturnType<typeof getAggregate>>

export default function Index() {
   const [period, setPeriod] = useState(getPastDate())

   const { data, isFetching } = useFetch({
      key: ["chart_data", period.label],
      url: `/transactions/periodic?time_period=${period.label}`,
      placeholderData: {}
   })

   const dataSet: DataSet[] = [
      //because of SVG ordering foreground elements must be put last.
      { label: "expenses", color: "text-green-600", data: [] },
      { label: "liquidation", color: "text-red-600", data: [] },
      { label: "revenue", color: "text-indigo-600", data: data.transactions, circle: true },
   ]

   return (
      <div className="w-full h-full flex bg-slate-50">
         <div className={`h-full w-full max-w-md p-8 bg-slate-100`}>
            <h2 className="text-2xl font-bold text-slate-600">Hello, Stranger</h2>
            <p className="opacity-70 mb-4 text-slate-600">Here are the stats for today</p>
            <div className="space-y-6 my-12 text-slate-700">
               <Detail
                  title="Revenue"
                  amount={45903493}
                  trend="15%"
                  currency="$"
                  icon={HiOutlineCurrencyDollar}
               />
               <Detail
                  title="Liquidations"
                  amount={7250000}
                  trend="-2.61%"
                  currency="$"
                  icon={HiOutlineChartPie}
               />
               <Detail
                  title="Expenses"
                  amount={1303493}
                  trend="0.04%"
                  icon={HiOutlineShoppingBag}
               />
               <Detail
                  title="Customers"
                  amount={167}
                  trend="10.45%"
                  icon={HiOutlineUserCircle}
               />
               <Detail
                  title="Transactions"
                  amount={93493}
                  trend="10.45%"
                  icon={HiCreditCard}
               />
            </div>
            <div className="rounded-xl bg-gradient-to-tr from-pink-700 to-indigo-500 grid place-content-center text-white text-center p-6 px-8 shadow-2xl space-y-2">
               <p className="text-3xl font-bold">MoneyBall '23</p>
               <p className="text-sm opacity-85">
                  Contented consisted continual curiosity contained get. Forth dried in aware do promotion.
               </p>
            </div>
         </div>
         <div className="w-full overflow-y-auto scrollbar p-8 space-y-6">
            <TransactionsChart
               title="Overview"
               dataSet={dataSet}
               setPeriod={setPeriod}
               period={period}
               loading={isFetching}
               shadow
            />
            <div className="max-w-xs">
               <Button goto="transaction" variant="blue">See all transactions</Button>
            </div>
            <div className="flex">
               <Activities title="Updates" />
               <Activities reverse />
            </div>
         </div>
      </div>
   );
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
            <h2 className="text-2xl lg:text-3xl font-medium">{modifiedAmount || "0"}</h2>
            <p className="uppercase tracking-wider text-xs">Total {props.title}</p>
            <p className="flex items-center whitespace-nowrap text-sm space-x-1"><FiArrowUp /><span>{props.trend}</span></p>
         </div>
      </div>
   )
}
