import { getPastDate, metricPrefix } from "@utils/index";
import { useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Button from "@components/Button";
import TransactionsChart from "@components/TransactionsChart"
import Activities from "@components/Activities";
import { json, LoaderFunction } from "@remix-run/node";
import { getSummary } from "@controllers/transactions.server";
import { useLoaderData } from "@remix-run/react";

type LoaderData = Awaited<ReturnType<typeof getSummary>>
// export const loader: LoaderFunction = async () => {
//   return json<LoaderData>(await getSummary());
// }

export default function Index() {
  // const data = useLoaderData() as LoaderData
  const data = {} as LoaderData
  const [endDate, setEndDate] = useState(getPastDate())

  const totalExpenses = 245000
  const totalTransactions = 1670

  const dataSet = [
    //because of SVG ordering foreground elements must be put last.
    { label: "expenses", color: "text-green-600", data: [] },
    { label: "liquidation", color: "text-red-600", data: [] },
    { label: "revenue", color: "text-indigo-600", data: [], circle: true },
  ]

  return (
    <div className="md:px-6 px-4 pb-4 flex-1 space-y-6">
      <div className="p-6 md:px-4 bg-indigo-600 space-y-2 md:space-y-0 divide-y md:divide-y-0 md:divide-x divide-indigo-500 md:grid md:grid-cols-5 items-center rounded-b-xl">
        <Detail
          title="Total Income"
          amount={data.investmentVolume}
          trend="15%"
          currency="N"
        />
        <Detail
          title="Net Liquidations"
          amount={data.liquidationVolume}
          trend="-2.01%"
          currency="N"
        />
        <Detail
          title="Net Expenses"
          amount={totalExpenses}
          trend="0.04%"
        />
        <Detail
          title="Customers"
          amount={167}
          trend="10.45%"
        />
        <Detail
          title="Transactions"
          amount={data.transactionCount}
          trend="10.45%"
        />
      </div>
      <TransactionsChart
        // key={isLoading}
        title="Overview"
        dataSet={dataSet}
        setEndDate={setEndDate}
        endDate={endDate}
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
