import { formatBaseCurrency } from "@utils/index";
import { getCustomers } from "./firebase.server";
import { getAllTransactions, getCustomerTransactions } from "./transactions";

export async function getAggregate(): Promise<AllAggregates> {
   console.log(`** Fetching records **`)
   // const customers = await getCustomers()
   // const transactions = await getAllTransactions()
   // const liquidationsRef = await _firestore.collection("liquidations").get()

   const liqTotals = 0
   // const invTotals = transactions.reduce((acc, liq) => {
   //    acc += liq.amount
   //    return acc
   // }, 0)

   const random = (n: number) => Math.floor(Math.random() * n)

   const responseData: AllAggregates = {
      // transactionCount: transactions.length,
      transactionCount: random(2000),
      customerCount: random(250),
      liquidationVolume: liqTotals,
      investmentVolume: random(4000000),
      expenseVolume: 0
   }

   return responseData
}

export async function getCustomerAggregate(customerID: string) {
   console.log(`>> Fetching aggregates for ${customerID}... <<`)
   const transactions = await getCustomerTransactions(customerID)
   const total_investment = transactions.reduce((acc, curr) => acc += curr.amount, 0)
   const total_liquidation = 0

   return {
      total_investment: total_investment,
      total_interest: formatBaseCurrency(0), //TODO
      total_liquidation: total_liquidation,
      balance: total_investment - total_liquidation, //TODO minus liquidation
      startDate: new Date().toISOString(),
      liquidations: [],
      transactions,
   }
}