import Activities from "@components/Activities";
import Button from "@components/Button";
import TransactionsChart from "@components/TransactionsChart";
import getAggregate from "@controllers/aggregates";
import { useFetch } from "@utils/fetch";
import { getPastDate, metricPrefix } from "@utils/index";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { FiArrowUp } from "react-icons/fi";

interface Props {
   aggregate: Awaited<ReturnType<typeof getAggregate>>
}

export default function Index(props: Props) {
   const [period, setPeriod] = useState(getPastDate())

   const { data: transactions } = useFetch({
      enabled: false,
      key: ["chart_data", period],
      // url: `transactions/date-ranged?from=${period.value}&to=${new Date().toISOString()}`
   })

   const dataSet = [
      //because of SVG ordering foreground elements must be put last.
      { label: "expenses", color: "text-green-600", data: props.aggregate.data.expenses },
      { label: "liquidation", color: "text-red-600", data: props.aggregate.data.liquidations },
      { label: "revenue", color: "text-indigo-600", data: props.aggregate.data.revenue, circle: true },
   ]

   return (
      <div className="md:px-6 px-4 pb-4 flex-1 space-y-6">
         <div className="p-6 md:px-4 bg-indigo-600 space-y-2 md:space-y-0 divide-y md:divide-y-0 md:divide-x divide-indigo-500 md:grid md:grid-cols-5 items-center rounded-b-xl">
            <Detail
               title="Revenue"
               amount={props.aggregate.investmentVolume}
               trend="15%"
               currency="N"
            />
            <Detail
               title="Liquidations"
               amount={props.aggregate.liquidationVolume}
               trend="-2.01%"
               currency="N"
            />
            <Detail
               title="Expenses"
               amount={props.aggregate.expenseVolume}
               trend="0.04%"
            />
            <Detail
               title="Customers"
               amount={167}
               trend="10.45%"
            />
            <Detail
               title="Transactions"
               amount={props.aggregate.transactionCount}
               trend="10.45%"
            />
         </div>
         <TransactionsChart
            // key={isLoading}
            title="Overview"
            dataSet={dataSet}
            setPeriod={setPeriod}
            period={period}
            shadow
         />
         <div className="max-w-xs">
            <Button goto="transaction" variant="blue">See all transactions</Button>
         </div>
         <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
            <Activities title="Updates" />
            <Activities reverse />
         </div>
      </div>
   );
}

interface DetailProps {
   title: string
   trend: string
   amount: number
   currency?: string
}
function Detail(props: DetailProps) {
   const modifiedAmount = props.amount && `${props.currency ? props.currency : ""}${metricPrefix(props.amount)}`

   return (
      <div className="pt-2 md:pt-0 md:pl-2 lg:pl-8 space-y-1">
         <p className="text-blue-300 uppercase tracking-wider text-xs">{props.title}</p>
         <div className="flex space-x-2 justify-between md:justify-start md:flex-col md:space-x-0 md:space-y-1">
            <h2 className="text-white text-2xl lg:text-3xl font-medium">{modifiedAmount || "0"}</h2>
            <p className="flex items-center text-blue-300 whitespace-nowrap text-sm space-x-1"><FiArrowUp /><span>{props.trend}</span></p>
         </div>
      </div>
   )
}

export const getServerSideProps: GetServerSideProps = async () => {
   const aggregate = await getAggregate()
   // const aggregate = {}

   return {
      props: {
         aggregate
      }
   }
}
