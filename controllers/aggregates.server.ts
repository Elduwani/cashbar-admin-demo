import { getAllFirebaseTransactions, getFirebaseCustomers, getFirebaseCustomerTransactions } from "@controllers/firebase.server";
import { formatBaseCurrency } from "@utils/index";

interface Aggregate {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
   data?: {
      revenue: Transaction[]
      liquidations: Liquidation[]
      expenses: Expense[]
   }
}

export async function getAggregate(): Promise<Aggregate> {
   console.log(`** Fetching records **`)
   const customers = await getFirebaseCustomers()
   const transactions = await getAllFirebaseTransactions()
   // const liquidationsRef = await _firestore.collection("liquidations").where('validated', '==', true).get()

   const liqTotals = 0
   const invTotals = transactions.reduce((acc, liq) => {
      acc += liq.amount
      return acc
   }, 0)

   const responseData: Aggregate = {
      transactionCount: transactions.length,
      customerCount: customers.length,
      liquidationVolume: liqTotals,
      investmentVolume: invTotals,
      expenseVolume: 0,
      // data: {
      //    expenses: [],
      //    liquidations: liquidationsRef.docs.map(mapDataId) as Liquidation[],
      //    revenue: revenueRef.docs.map(mapDataId) as Transaction[],
      // }
   }

   return responseData
}

export async function getCustomerAggregate(customerID: number) {
   console.log(`>> Fetching aggregates for ${customerID}... <<`)
   const transactions = await getFirebaseCustomerTransactions(customerID)
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