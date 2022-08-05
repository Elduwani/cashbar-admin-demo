import PageTitle from "@components/PageTitle"
import TabsList from "@components/TabsList"
import { useState } from "react"

export default function TransationsLayout({ children }: { children: React.ReactElement }) {
   const [tabIndex, setTabIndex] = useState(0)

   const tabs: _Tab[] = [
      { name: "revenue", route: '/transactions' },
      { name: "liquidations", route: '/transactions/liquidations' },
   ]

   return (
      <div className="p-8 pt-0 flex flex-col h-full space-y-4">
         <PageTitle title="Transactions" />
         <TabsList tabs={tabs} setIndex={setTabIndex} index={tabIndex} />
         <div className="flex-1 mt-4">
            {children}
         </div>
      </div>
   )
}
