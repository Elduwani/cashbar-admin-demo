import Activities from "@components/Activities";
import Button from "@components/Button";
import TransactionsChart, { DataSet } from "@components/TransactionsChart";
import { getAggregate } from "@controllers/aggregates.server";
import HomeAggregate from "@layouts/home/Home.aggregate";
import { getPastDate } from "@utils/chart.utils";
import { useFetch } from "@utils/fetch";
import { useState } from "react";

export default function Index() {
   const [period, setPeriod] = useState(getPastDate())

   const chartData = useFetch({
      key: ["chart_data", period.label],
      url: `/transactions/periodic?time_period=${period.label}`,
      placeholderData: {} as _Object
   })

   const dataSet: DataSet[] = [
      //because of SVG ordering foreground elements must be put last.
      { label: "expenses", color: "text-green-600", data: [] },
      { label: "liquidation", color: "text-red-600", data: [] },
      { label: "revenue", color: "text-indigo-600", data: chartData.data.transactions, circle: true },
   ]

   return (
      <div className="w-full h-full flex bg-slate-50">
         <div className={`h-full w-full max-w-md p-8 bg-slate-100`}>
            <HomeAggregate />
         </div>
         <div className="w-full overflow-y-auto scrollbar p-8 space-y-6">
            <TransactionsChart
               title="Overview"
               dataSet={dataSet}
               setPeriod={setPeriod}
               period={period}
               loading={chartData.isFetching}
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
